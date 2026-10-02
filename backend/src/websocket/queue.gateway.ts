import { Server, Socket } from "socket.io";

// ============================================================
// SOCKET.IO SERVER
// ============================================================

let io: Server | null = null;

// ============================================================
// TYPES
// ============================================================

export type QueueGatewayData = Record<
  string,
  unknown
>;

// ============================================================
// ROOM HELPERS
// ============================================================

export function getCompanyRoom(
  companyId: string
): string {
  return `company:${companyId}`;
}

export function getDepartmentRoom(
  companyId: string,
  departmentId: string
): string {
  return `company:${companyId}:department:${departmentId}`;
}

export function getServiceRoom(
  companyId: string,
  serviceId: string
): string {
  return `company:${companyId}:service:${serviceId}`;
}

export function getEmployeeRoom(
  companyId: string,
  employeeId: string
): string {
  return `company:${companyId}:employee:${employeeId}`;
}

// ============================================================
// VALIDATION
// ============================================================

function isValidId(
  value: unknown
): value is string {
  return (
    typeof value === "string" &&
    value.trim().length > 0
  );
}

// ============================================================
// INITIALIZE SOCKET.IO
// ============================================================

export function initQueueGateway(
  server: Server
): void {
  io = server;

  console.log(
    "✅ Queue WebSocket gateway initialized."
  );

  // ==========================================================
  // CONNECTION
  // ==========================================================

  io.on(
    "connection",
    (socket: Socket) => {
      console.log(
        `🔌 Socket connected: ${socket.id}`
      );

      // ======================================================
      // JOIN COMPANY
      // ======================================================

      socket.on(
        "join-company",
        (companyId: unknown) => {
          if (!isValidId(companyId)) {
            console.warn(
              `⚠️ Invalid companyId from socket ${socket.id}`
            );

            return;
          }

          const cleanCompanyId =
            companyId.trim();

          const room =
            getCompanyRoom(
              cleanCompanyId
            );

          socket.join(room);

          console.log(
            `🏢 ${socket.id} joined ${room}`
          );

          socket.emit(
            "joined-company",
            {
              companyId:
                cleanCompanyId,
              room,
            }
          );
        }
      );

      // ======================================================
      // JOIN DEPARTMENT
      // ======================================================

      socket.on(
        "join-department",
        (data: unknown) => {
          if (
            !data ||
            typeof data !== "object"
          ) {
            return;
          }

          const {
            companyId,
            departmentId,
          } =
            data as {
              companyId?: unknown;
              departmentId?: unknown;
            };

          if (
            !isValidId(companyId) ||
            !isValidId(departmentId)
          ) {
            console.warn(
              `⚠️ Invalid department room request from ${socket.id}`
            );

            return;
          }

          const room =
            getDepartmentRoom(
              companyId.trim(),
              departmentId.trim()
            );

          socket.join(room);

          console.log(
            `🏢 ${socket.id} joined ${room}`
          );

          socket.emit(
            "joined-department",
            {
              companyId:
                companyId.trim(),
              departmentId:
                departmentId.trim(),
              room,
            }
          );
        }
      );

      // ======================================================
      // JOIN SERVICE
      // ======================================================

      socket.on(
        "join-service",
        (data: unknown) => {
          if (
            !data ||
            typeof data !== "object"
          ) {
            return;
          }

          const {
            companyId,
            serviceId,
          } =
            data as {
              companyId?: unknown;
              serviceId?: unknown;
            };

          if (
            !isValidId(companyId) ||
            !isValidId(serviceId)
          ) {
            console.warn(
              `⚠️ Invalid service room request from ${socket.id}`
            );

            return;
          }

          const room =
            getServiceRoom(
              companyId.trim(),
              serviceId.trim()
            );

          socket.join(room);

          console.log(
            `🛠️ ${socket.id} joined ${room}`
          );

          socket.emit(
            "joined-service",
            {
              companyId:
                companyId.trim(),
              serviceId:
                serviceId.trim(),
              room,
            }
          );
        }
      );

      // ======================================================
      // JOIN EMPLOYEE
      // ======================================================

      socket.on(
        "join-employee",
        (data: unknown) => {
          if (
            !data ||
            typeof data !== "object"
          ) {
            return;
          }

          const {
            companyId,
            employeeId,
          } =
            data as {
              companyId?: unknown;
              employeeId?: unknown;
            };

          if (
            !isValidId(companyId) ||
            !isValidId(employeeId)
          ) {
            console.warn(
              `⚠️ Invalid employee room request from ${socket.id}`
            );

            return;
          }

          const room =
            getEmployeeRoom(
              companyId.trim(),
              employeeId.trim()
            );

          socket.join(room);

          console.log(
            `👤 ${socket.id} joined ${room}`
          );

          socket.emit(
            "joined-employee",
            {
              companyId:
                companyId.trim(),
              employeeId:
                employeeId.trim(),
              room,
            }
          );
        }
      );

      // ======================================================
      // DISCONNECT
      // ======================================================

      socket.on(
        "disconnect",
        (reason) => {
          console.log(
            `🔌 Socket disconnected: ${socket.id} - ${reason}`
          );
        }
      );
    }
  );
}

// ============================================================
// EMIT COMPANY QUEUE UPDATE
// ============================================================

export function emitQueueUpdate(
  companyId: string,
  data: QueueGatewayData
): void {
  if (!io) {
    console.warn(
      "⚠️ Queue gateway is not initialized."
    );

    return;
  }

  if (!isValidId(companyId)) {
    console.warn(
      "⚠️ Cannot emit queue update: invalid companyId."
    );

    return;
  }

  const room =
    getCompanyRoom(
      companyId.trim()
    );

  console.log(
    `📡 Queue update → ${room}`,
    data
  );

  io.to(room).emit(
    "queue-update",
    data
  );
}

// ============================================================
// EMIT DEPARTMENT UPDATE
// ============================================================

export function emitDepartmentQueueUpdate(
  companyId: string,
  departmentId: string,
  data: QueueGatewayData
): void {
  if (!io) {
    console.warn(
      "⚠️ Queue gateway is not initialized."
    );

    return;
  }

  if (
    !isValidId(companyId) ||
    !isValidId(departmentId)
  ) {
    return;
  }

  const room =
    getDepartmentRoom(
      companyId.trim(),
      departmentId.trim()
    );

  console.log(
    `📡 Department update → ${room}`,
    data
  );

  io.to(room).emit(
    "queue-update",
    data
  );
}

// ============================================================
// EMIT SERVICE UPDATE
// ============================================================

export function emitServiceQueueUpdate(
  companyId: string,
  serviceId: string,
  data: QueueGatewayData
): void {
  if (!io) {
    console.warn(
      "⚠️ Queue gateway is not initialized."
    );

    return;
  }

  if (
    !isValidId(companyId) ||
    !isValidId(serviceId)
  ) {
    return;
  }

  const room =
    getServiceRoom(
      companyId.trim(),
      serviceId.trim()
    );

  console.log(
    `📡 Service update → ${room}`,
    data
  );

  io.to(room).emit(
    "queue-update",
    data
  );
}

// ============================================================
// EMIT EMPLOYEE UPDATE
// ============================================================

export function emitEmployeeUpdate(
  companyId: string,
  employeeId: string,
  data: QueueGatewayData
): void {
  if (!io) {
    console.warn(
      "⚠️ Queue gateway is not initialized."
    );

    return;
  }

  if (
    !isValidId(companyId) ||
    !isValidId(employeeId)
  ) {
    return;
  }

  const room =
    getEmployeeRoom(
      companyId.trim(),
      employeeId.trim()
    );

  console.log(
    `📡 Employee update → ${room}`,
    data
  );

  io.to(room).emit(
    "queue-update",
    data
  );
}

// ============================================================
// CUSTOMER CALLED
// ============================================================

export function emitCustomerCalled(
  companyId: string,
  data: {
    displayNumber: string;
    desk: string;
    service: string;
  }
): void {
  if (!io) {
    console.warn(
      "⚠️ Queue gateway is not initialized."
    );

    return;
  }

  if (!isValidId(companyId)) {
    console.warn(
      "⚠️ Cannot emit CUSTOMER_CALLED: invalid companyId."
    );

    return;
  }

  const payload = {
    event: "CUSTOMER_CALLED",
    displayNumber:
      data.displayNumber,
    desk: data.desk,
    service: data.service,
  };

  const room =
    getCompanyRoom(
      companyId.trim()
    );

  console.log(
    `📢 CUSTOMER_CALLED → ${room}`,
    payload
  );

  io.to(room).emit(
    "queue-update",
    payload
  );
}

// ============================================================
// CARD UPDATE
// ============================================================

export function emitCardUpdate(
  companyId: string,
  data: QueueGatewayData
): void {
  if (!io) {
    return;
  }

  if (!isValidId(companyId)) {
    return;
  }

  const room =
    getCompanyRoom(
      companyId.trim()
    );

  console.log(
    `💳 Card update → ${room}`,
    data
  );

  io.to(room).emit(
    "card-update",
    data
  );
}

// ============================================================
// NOTIFICATION
// ============================================================

export function emitNotification(
  companyId: string,
  data: QueueGatewayData
): void {
  if (!io) {
    return;
  }

  if (!isValidId(companyId)) {
    return;
  }

  const room =
    getCompanyRoom(
      companyId.trim()
    );

  console.log(
    `🔔 Notification → ${room}`,
    data
  );

  io.to(room).emit(
    "notification",
    data
  );
}

// ============================================================
// GET SOCKET.IO SERVER
// ============================================================

export function getQueueGateway():
  Server | null {
  return io;
}