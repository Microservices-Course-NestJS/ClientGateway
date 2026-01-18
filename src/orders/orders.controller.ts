import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, ParseUUIDPipe, Query } from '@nestjs/common';
import { ORDER_SERVICE } from 'src/config/services';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CreateOrderDto, OrderPaginationDto } from './dto';
import { firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common';
import { StatusDto } from './dto/status.dto';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(ORDER_SERVICE)
    private readonly orderService: ClientProxy,
  ) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.send('createOrder', {...createOrderDto});
  }

  @Get()
  findAll(@Query() orderPaginationDto: OrderPaginationDto) {
    return this.orderService.send('findAllOrders', {...orderPaginationDto});
  }

  @Get('id/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    try {
      const order = await firstValueFrom( 
        this.orderService.send('findOneOrder', {id})
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
        this.orderService.send('findAllOrders', {...statusDto, ...paginationDto})
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
        this.orderService.send('changeOrderStatus', {id, status: statusDto.status})
      );
      return order;
    } catch (error) {
      throw new RpcException(error)      
    }
  }
}
