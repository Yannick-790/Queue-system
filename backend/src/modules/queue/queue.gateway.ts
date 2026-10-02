import { Server } from "socket.io";

let io: Server | null = null;

// ----------------------------------------------------
// Types
// ----------------------------------------------------

export interface CustomerCalledData {
  event: "CUSTOMER_CALLED";
  displayNumber: string;
  desk: string;
  service: string;
}

export interface QueueUpdateData {
  event: string;
  displayNumber?: string;
  desk?: string;
  service?: string;
  [key: string]: unknown;
}

// ----------------------------------------------------
// Initialize Socket.IO
// ----------------------------------------------------

export function initializeDisplayGateway(server: Server): void {
  io = server;

  console.log("Display WebSocket gateway initialized.");
}

// ----------------------------------------------------
// Broadcast Customer Called
// ----------------------------------------------------

export function broadcastCustomerCalled(
  companyId: string,
  data: {
    displayNumber: string;
    desk: string;
    service: string;
  }
): void {
  if (!io) {
    console.warn(
      "Display gateway: Socket.IO has not been initialized."
    );

    return;
  }

  const payload: CustomerCalledData = {
    event: "CUSTOMER_CALLED",
    displayNumber: data.displayNumber,
    desk: data.desk,
    service: data.service,
  };

  console.log(
    `Broadcasting CUSTOMER_CALLED to company:${companyId}`,
    payload
  );

  io.to(`company:${companyId}`).emit(
    "queue-update",
    payload
  );
}

// ----------------------------------------------------
// Broadcast General Queue Update
// ----------------------------------------------------

export function broadcastQueueUpdate(
  companyId: string,
  data: QueueUpdateData
): void {
  if (!io) {
    console.warn(
      "Display gateway: Socket.IO has not been initialized."
    );

    return;
  }

  console.log(
    `Broadcasting queue update to company:${companyId}`,
    data
  );

  io.to(`company:${companyId}`).emit(
    "queue-update",
    data
  );
}

// ----------------------------------------------------
// Broadcast Queue Update To A Department
// ----------------------------------------------------

export function broadcastDepartmentQueueUpdate(
  companyId: string,
  departmentId: string,
  data: QueueUpdateData
): void {
  if (!io) {
    console.warn(
      "Display gateway: Socket.IO has not been initialized."
    );

    return;
  }

  console.log(
    `Broadcasting queue update to department:${departmentId}`,
    data
  );

  io.to(`company:${companyId}:department:${departmentId}`).emit(
    "queue-update",
    data
  );
}

// ----------------------------------------------------
// Broadcast Queue Update To A Service
// ----------------------------------------------------

export function broadcastServiceQueueUpdate(
  companyId: string,
  serviceId: string,
  data: QueueUpdateData
): void {
  if (!io) {
    console.warn(
      "Display gateway: Socket.IO has not been initialized."
    );

    return;
  }

  console.log(
    `Broadcasting queue update to service:${serviceId}`,
    data
  );

  io.to(`company:${companyId}:service:${serviceId}`).emit(
    "queue-update",
    data
  );
}

// ----------------------------------------------------
// Broadcast To A Specific Employee
// ----------------------------------------------------

export function broadcastEmployeeUpdate(
  companyId: string,
  employeeId: string,
  data: QueueUpdateData
): void {
  if (!io) {
    console.warn(
      "Display gateway: Socket.IO has not been initialized."
    );

    return;
  }

  console.log(
    `Broadcasting employee update to employee:${employeeId}`,
    data
  );

  io.to(`company:${companyId}:employee:${employeeId}`).emit(
    "queue-update",
    data
  );
}

// ----------------------------------------------------
// Get Socket.IO Instance
// ----------------------------------------------------

export function getDisplayGateway(): Server | null {
  return io;
}