datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  USER
  SELLER
  ADMIN
}

enum OrderStatus {
  PENDING_PAYMENT
  PAID
  DELIVERED
  COMPLETED
  IN_DISPUTE
  REFUNDED
}

model User {
  id            String    @id @default(uuid())
  name          String
  email         String    @unique
  password      String
  role          Role      @default(USER)
  isVerified    Boolean   @default(false)
  balance       Float     @default(0.0)
  frozenBalance Float     @default(0.0)
  image         String?   @db.Text
  createdAt     DateTime  @default(now())

  products      Product[]
  ordersAsBuyer Order[]   @relation("BuyerOrders")
  ordersAsSeller Order[]  @relation("SellerOrders")
  requests      SellerRequest[]
  chatsAsBuyer  ChatRoom[] @relation("BuyerChats")
  chatsAsSeller ChatRoom[] @relation("SellerChats")
  messages      Message[]  @relation("Sender")
  questions     Question[]
  reviews       Review[]
}

model SellerRequest {
  id         String   @id @default(uuid())
  userId     String
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  fullName   String
  cpf        String
  whatsapp   String
  games      String
  experience String
  status     String   @default("PENDING")
  createdAt  DateTime @default(now())
}

model Product {
  id          String   @id @default(uuid())
  sellerId    String
  seller      User     @relation(fields: [sellerId], references: [id], onDelete: Cascade)
  title       String
  description String
  price       Float
  category    String
  image       String?  @db.Text
  isBoosted   Boolean  @default(false)
  status      String   @default("active")
  createdAt   DateTime @default(now())
  orders      Order[]
  questions   Question[]
}

model Question {
  id        String   @id @default(uuid())
  productId String
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  text      String   @db.Text
  answer    String?  @db.Text
  createdAt DateTime @default(now())
}

model Order {
  id                String      @id @default(uuid())
  productId         String
  product           Product     @relation(fields: [productId], references: [id])
  buyerId           String
  buyer             User        @relation("BuyerOrders", fields: [buyerId], references: [id])
  sellerId          String
  seller            User        @relation("SellerOrders", fields: [sellerId], references: [id])
  amount            Float
  status            OrderStatus @default(PENDING_PAYMENT)
  deliveredBySeller Boolean     @default(false)
  acceptedByBuyer   Boolean     @default(false)
  payoutReadyAt     DateTime?
  createdAt         DateTime    @default(now())
  review            Review?
}

model Review {
  id        String   @id @default(uuid())
  orderId   String   @unique
  order     Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  rating    Int
  comment   String   @db.Text
  createdAt DateTime @default(now())
}

model SupportTicket {
  id        String   @id @default(uuid())
  name      String
  email     String
  message   String   @db.Text
  status    String   @default("OPEN") // OPEN, RESOLVED
  createdAt DateTime @default(now())
}

model ChatRoom {
  id         String    @id @default(uuid())
  buyerId    String
  buyer      User      @relation("BuyerChats", fields: [buyerId], references: [id])
  sellerId   String
  seller     User      @relation("SellerChats", fields: [sellerId], references: [id])
  createdAt  DateTime  @default(now())
  messages   Message[]

  @@unique([buyerId, sellerId])
}

model Message {
  id         String   @id @default(uuid())
  roomId     String
  room       ChatRoom @relation(fields: [roomId], references: [id], onDelete: Cascade)
  senderId   String
  sender     User     @relation("Sender", fields: [senderId], references: [id])
  text       String   @db.Text
  createdAt  DateTime @default(now())
}
