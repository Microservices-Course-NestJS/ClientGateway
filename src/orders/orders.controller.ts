import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, ParseUUIDPipe, Query } from '@nestjs/common';
import { NATS_SERVICE, ORDER_SERVICE } from 'src/config/services';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CreateOrderDto, OrderPaginationDto } from './dto';
import { firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common';
import { StatusDto } from './dto/status.dto';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(NATS_SERVICE)
    private readonly natsClient: ClientProxy,
  ) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.natsClient.send('createOrder', {...createOrderDto});
  }

  @Get()
  findAll(@Query() orderPaginationDto: OrderPaginationDto) {
    return this.natsClient.send('findAllOrders', {...orderPaginationDto});
  }

  @Get('id/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    try {
      const order = await firstValueFrom( 
        this.natsClient.send('findOneOrder', {id})
      );
      return order
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get(':status')
  async findAllByStatus(
    @Param() statusDto: StatusDto,
    @Query() paginationDto: PaginationDto
  ) {
    try {
      const orders = await firstValueFrom( 
        this.natsClient.send('findAllOrders', {...statusDto, ...paginationDto})
      );
      return orders
    } catch (error) {
      throw new RpcException(error);
    }
  }
  @Patch(':id')
  async changeStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() statusDto: StatusDto
  ){
    try {
      const order = await firstValueFrom(
        this.natsClient.send('changeOrderStatus', {id, status: statusDto.status})
      );
      return order;
    } catch (error) {
      throw new RpcException(error)      
    }
  }
}
