import { Server } from 'socket.io';
export declare class SocketGateway {
    server: Server;
    sendSanphamUpdate(): void;
    sendKhachangUpdate(): void;
    senduserUpdate(): void;
}
