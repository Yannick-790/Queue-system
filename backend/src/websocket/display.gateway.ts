import { Server, Socket } from "socket.io";

// ============================================================
// SOCKET.IO INSTANCE
// ============================================================

let io: Server | null = null;

// ============================================================
// TYPES
// ============================================================

export interface CustomerCalledData {
  event: "CUSTOMER_CALLED";
  displayNumber: string;
  desk: string;
  service: string;
}

export interface QueueUpdateData {
  /**
   * Main queue event identifier.
   *
   * Your QueueService currently uses:
   *
   * type: "CUSTOMER_CALLED"
   * type: "SERVICE_COMPLETED"
   * type: "CUSTOMER_TRANSFERRED"
   * type: "CUSTOMER_NO_SHOW"
   * type: "CUSTOMER_RECALLED"
   * type: "DESK_STATUS_CHANGED"
   * type: "TICKET_CANCELLED"
   */
  type?: string;

  /**
   * Some clients/events may use `event`
   * instead of `type`.
   */
  event?: string;

  displayNumber?: string;
  desk?: string;
  service?: string;

  ticketId?: string;
  deskId?: string;

  /**
   * Nullable because Employee.serviceId is nullable
   * in the Prisma schema.
   */
  serviceId?: string | null;

  departmentId?: string;
  employeeId?: string;

  fromServiceId?: string | null;
  toServiceId?: string;

  status?: string;

  [key: string]: unknown;
}

// ============================================================
// ROOM HELPERS
// ============================================================

function getCompanyRoom(companyId: string): string {
  return `company:${companyId}`;
}

function getDepartmentRoom(
  companyId: string,
  departmentId: string
): string {
  return `company:${companyId}:department:${departmentId}`;
}

function getServiceRoom(
  companyId: string,
  serviceId: string
): string {
  return `company:${companyId}:service:${serviceId}`;
}

function getEmployeeRoom(
  companyId: string,
  employeeId: string
): string {
  return `company:${companyId}:employee:${employeeId}`;
}

// ============================================================
// VALIDATION
// ============================================================

function isValidId(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.trim().length > 0
  );
}

// ============================================================
// INITIALIZE GATEWAY
//
// Call this ONCE when the HTTP server starts.
//
// Example:
//
// const io = new Server(server, {...});
//
// initializeDisplayGateway(io);
// ============================================================

export function initializeDisplayGateway(
  server: Server
): void {
  // Prevent accidental double initialization.
  if (io) {
    console.warn(
      "⚠️ Display WebSocket gateway was already initialized."
    );

    return;
  }

  io = server;

  console.log(
    "✅ Display WebSocket gateway initialized."
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

      // ========================================================
      // JOIN COMPANY
      // ========================================================

      socket.on(
        "join-company",
        (companyId: unknown) => {
          if (!isValidId(companyId)) {
            console.warn(
              `⚠️ Invalid companyId from socket ${socket.id}`
            );

            socket.emit(
              "socket-error",
              {
                message:
                  "Invalid company ID.",
              }
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
            `🏢 Socket ${socket.id} joined ${room}`
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

      // ========================================================
      // JOIN DEPARTMENT
      // ========================================================

      socket.on(
        "join-department",
        (data: unknown) => {
          if (
            typeof data !== "object" ||
            data === null
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

          const cleanCompanyId =
            companyId.trim();

          const cleanDepartmentId =
            departmentId.trim();

          const room =
            getDepartmentRoom(
              cleanCompanyId,
              cleanDepartmentId
            );

          socket.join(room);

          console.log(
            `🏢 Socket ${socket.id} joined ${room}`
          );

          socket.emit(
            "joined-department",
            {
              companyId:
                cleanCompanyId,
              departmentId:
                cleanDepartmentId,
              room,
            }
          );
        }
      );

      // ========================================================
      // JOIN SERVICE
      // ========================================================

      socket.on(
        "join-service",
        (data: unknown) => {
          if (
            typeof data !== "object" ||
            data === null
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

          const cleanCompanyId =
            companyId.trim();

          const cleanServiceId =
            serviceId.trim();

          const room =
            getServiceRoom(
              cleanCompanyId,
              cleanServiceId
            );

          socket.join(room);

          console.log(
            `🛠️ Socket ${socket.id} joined ${room}`
          );

          socket.emit(
            "joined-service",
            {
              companyId:
                cleanCompanyId,
              serviceId:
                cleanServiceId,
              room,
            }
          );
        }
      );

      // ========================================================
      // JOIN EMPLOYEE
      // ========================================================

      socket.on(
        "join-employee",
        (data: unknown) => {
          if (
            typeof data !== "object" ||
            data === null
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

          const cleanCompanyId =
            companyId.trim();

          const cleanEmployeeId =
            employeeId.trim();

          const room =
            getEmployeeRoom(
              cleanCompanyId,
              cleanEmployeeId
            );

          socket.join(room);

          console.log(
            `👤 Socket ${socket.id} joined ${room}`
          );

          socket.emit(
            "joined-employee",
            {
              companyId:
                cleanCompanyId,
              employeeId:
                cleanEmployeeId,
              room,
            }
          );
        }
      );

      // ========================================================
      // DISCONNECT
      // ========================================================

      socket.on(
        "disconnect",
        (reason) => {
          console.log(
            `🔌 Socket disconnected: ${socket.id} (${reason})`
          );
        }
      );
    }
  );
}

// ============================================================
// CUSTOMER CALLED
//
// Employee clicks:
//
// CALL NEXT
//
// Database:
//
// WAITING
//   ↓
// SERVING
//
// Then this broadcasts:
//
// CUSTOMER_CALLED
//
// to the company's public display.
// ============================================================

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
      "⚠️ Display gateway has not been initialized."
    );

    return;
  }

  if (!isValidId(companyId)) {
    console.warn(
      "⚠️ Cannot broadcast CUSTOMER_CALLED: invalid companyId."
    );

    return;
  }

  const payload: CustomerCalledData = {
    event: "CUSTOMER_CALLED",

    displayNumber:
      data.displayNumber,

    desk:
      data.desk,

    service:
      data.service,
  };

  const room =
    getCompanyRoom(
      companyId
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
// GENERAL COMPANY QUEUE UPDATE
// ============================================================

export function broadcastQueueUpdate(
  companyId: string,
  data: QueueUpdateData
): void {
  if (!io) {
    console.warn(
      "⚠️ Display gateway has not been initialized."
    );

    return;
  }

  if (!isValidId(companyId)) {
    console.warn(
      "⚠️ Cannot broadcast queue update: invalid companyId."
    );

    return;
  }

  const room =
    getCompanyRoom(
      companyId
    );

  console.log(
    `📡 QUEUE UPDATE → ${room}`,
    data
  );

  io.to(room).emit(
    "queue-update",
    data
  );
}

// ============================================================
// DEPARTMENT QUEUE UPDATE
// ============================================================

export function broadcastDepartmentQueueUpdate(
  companyId: string,
  departmentId: string,
  data: QueueUpdateData
): void {
  if (!io) {
    console.warn(
      "⚠️ Display gateway has not been initialized."
    );

    return;
  }

  if (
    !isValidId(companyId) ||
    !isValidId(departmentId)
  ) {
    console.warn(
      "⚠️ Invalid companyId or departmentId."
    );

    return;
  }

  const room =
    getDepartmentRoom(
      companyId,
      departmentId
    );

  console.log(
    `📡 DEPARTMENT UPDATE → ${room}`,
    data
  );

  io.to(room).emit(
    "queue-update",
    data
  );
}

// ============================================================
// SERVICE QUEUE UPDATE
// ============================================================

export function broadcastServiceQueueUpdate(
  companyId: string,
  serviceId: string,
  data: QueueUpdateData
): void {
  if (!io) {
    console.warn(
      "⚠️ Display gateway has not been initialized."
    );

    return;
  }

  if (
    !isValidId(companyId) ||
    !isValidId(serviceId)
  ) {
    console.warn(
      "⚠️ Invalid companyId or serviceId."
    );

    return;
  }

  const room =
    getServiceRoom(
      companyId,
      serviceId
    );

  console.log(
    `📡 SERVICE UPDATE → ${room}`,
    data
  );

  io.to(room).emit(
    "queue-update",
    data
  );
}

// ============================================================
// EMPLOYEE UPDATE
// ============================================================

export function broadcastEmployeeUpdate(
  companyId: string,
  employeeId: string,
  data: QueueUpdateData
): void {
  if (!io) {
    console.warn(
      "⚠️ Display gateway has not been initialized."
    );

    return;
  }

  if (
    !isValidId(companyId) ||
    !isValidId(employeeId)
  ) {
    console.warn(
      "⚠️ Invalid companyId or employeeId."
    );

    return;
  }

  const room =
    getEmployeeRoom(
      companyId,
      employeeId
    );

  console.log(
    `📡 EMPLOYEE UPDATE → ${room}`,
    data
  );

  io.to(room).emit(
    "queue-update",
    data
  );
}

// ============================================================
// CARD UPDATE
// ============================================================

export function broadcastCardUpdate(
  companyId: string,
  data: QueueUpdateData
): void {
  if (!io) {
    console.warn(
      "⚠️ Display gateway has not been initialized."
    );

    return;
  }

  if (!isValidId(companyId)) {
    console.warn(
      "⚠️ Invalid companyId."
    );

    return;
  }

  const room =
    getCompanyRoom(
      companyId
    );

  console.log(
    `💳 CARD UPDATE → ${room}`,
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

export function broadcastNotification(
  companyId: string,
  data: QueueUpdateData
): void {
  if (!io) {
    console.warn(
      "⚠️ Display gateway has not been initialized."
    );

    return;
  }

  if (!isValidId(companyId)) {
    console.warn(
      "⚠️ Invalid companyId."
    );

    return;
  }

  const room =
    getCompanyRoom(
      companyId
    );

  console.log(
    `🔔 NOTIFICATION → ${room}`,
    data
  );

  io.to(room).emit(
    "notification",
    data
  );
}

// ============================================================
// GET SOCKET.IO INSTANCE
// ============================================================

export function getDisplayGateway(): Server | null {
  return io;
}