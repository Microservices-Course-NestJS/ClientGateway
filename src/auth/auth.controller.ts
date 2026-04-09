import { Body, Controller, Get, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config/services';
import { LoginUserDTO, RegisterUserDTO } from './dto';
import { catchError } from 'rxjs';
import { AuthGuard } from './guards/auth.guard';
import { Token, User } from './decorators';
import type { CurrentUser } from './interfaces/current-user.interface';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(NATS_SERVICE) //Identificar el nombre del servicio a inyectar
    private readonly Client: ClientProxy
  ) { }

  @Post('register')
  registerUser(@Body() registerUserDto: RegisterUserDTO) {
    return this.Client.send('auth.register.user', registerUserDto).pipe(
      catchError(error => {
        throw new RpcException(error);
      })
    )
  }


  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDTO) {
    return this.Client.send('auth.login.user', loginUserDto)

  }

  @UseGuards(AuthGuard)
  @Get('verify')
  verifyUser(
    @User() user: CurrentUser,
    @Token() token: string
  ) {
    return {user, token}
  }

}
