import { WebSocketGateway, WebSocketServer, SubscribeMessage } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketGateway {
  @WebSocketServer() server: Server;

  // Gửi sự kiện cập nhật sản phẩm đến tất cả client
  sendSanphamUpdate() {
    this.server.emit('sanpham-updated'); // FE sẽ nhận sự kiện này
  }
  sendKhachangUpdate() {
    this.server.emit('khachhang-updated'); // FE sẽ nhận sự kiện này
  }
  senduserUpdate() {
    this.server.emit('user-updated'); // FE sẽ nhận sự kiện này
  }
}
