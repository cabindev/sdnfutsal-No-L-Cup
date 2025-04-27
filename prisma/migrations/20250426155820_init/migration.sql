-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NULL,
    `role` ENUM('MEMBER', 'ADMIN') NOT NULL DEFAULT 'MEMBER',
    `emailVerified` DATETIME(3) NULL,
    `resetToken` VARCHAR(191) NULL,
    `resetTokenCreatedAt` DATETIME(3) NULL,
    `resetTokenExpiresAt` DATETIME(3) NULL,
    `lastPasswordReset` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_resetToken_key`(`resetToken`),
    INDEX `User_email_idx`(`email`),
    INDEX `User_role_idx`(`role`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Location` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `district` VARCHAR(191) NOT NULL,
    `amphoe` VARCHAR(191) NOT NULL,
    `province` VARCHAR(191) NOT NULL,
    `zone` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Location_province_idx`(`province`),
    INDEX `Location_zone_idx`(`zone`),
    UNIQUE INDEX `Location_district_amphoe_province_key`(`district`, `amphoe`, `province`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TrainingBatch` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `batchNumber` INTEGER NOT NULL,
    `year` INTEGER NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `maxParticipants` INTEGER NOT NULL,
    `registrationEndDate` DATETIME(3) NOT NULL,
    `description` TEXT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BatchParticipant` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `batchId` INTEGER NOT NULL,
    `coachId` INTEGER NOT NULL,
    `registeredAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED', 'CANCELED') NOT NULL DEFAULT 'PENDING',
    `notes` TEXT NULL,
    `isAttended` BOOLEAN NOT NULL DEFAULT false,

    INDEX `BatchParticipant_batchId_idx`(`batchId`),
    INDEX `BatchParticipant_coachId_idx`(`coachId`),
    UNIQUE INDEX `BatchParticipant_batchId_coachId_key`(`batchId`, `coachId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Coach` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `teamName` VARCHAR(191) NULL,
    `nickname` VARCHAR(191) NULL,
    `gender` ENUM('MALE', 'FEMALE', 'LGBTQ') NOT NULL,
    `age` INTEGER NOT NULL,
    `idCardNumber` VARCHAR(191) NOT NULL,
    `address` TEXT NOT NULL,
    `phoneNumber` VARCHAR(191) NOT NULL,
    `lineId` VARCHAR(191) NULL,
    `religion` ENUM('BUDDHIST', 'CHRISTIAN', 'ISLAM', 'HINDU', 'OTHER') NOT NULL,
    `hasMedicalCondition` BOOLEAN NOT NULL DEFAULT false,
    `medicalCondition` TEXT NULL,
    `foodPreference` ENUM('GENERAL', 'VEGETARIAN', 'HALAL', 'JAY') NOT NULL DEFAULT 'GENERAL',
    `coachStatus` ENUM('GOVERNMENT_EMPLOYEE', 'CIVIL_SERVANT', 'ACADEMY_EMPLOYEE', 'ACADEMY_OWNER', 'VOLUNTEER', 'OTHER') NOT NULL,
    `coachExperience` INTEGER NOT NULL,
    `participationCount` INTEGER NOT NULL,
    `accommodation` BOOLEAN NOT NULL DEFAULT true,
    `shirtSize` ENUM('M', 'L', 'XL', 'XXL', 'XXXL', 'XXXXL', 'XXXXXL') NOT NULL,
    `expectations` TEXT NULL,
    `locationId` INTEGER NULL,
    `isApproved` BOOLEAN NOT NULL DEFAULT false,
    `registrationCompleted` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Coach_idCardNumber_key`(`idCardNumber`),
    INDEX `Coach_userId_idx`(`userId`),
    INDEX `Coach_teamName_idx`(`teamName`),
    INDEX `Coach_locationId_idx`(`locationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TrainingCourse` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `TrainingCourse_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CoachTraining` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `coachId` INTEGER NOT NULL,
    `courseId` INTEGER NOT NULL,
    `certificateImg` VARCHAR(191) NULL,
    `trainingYear` INTEGER NULL,
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `CoachTraining_coachId_idx`(`coachId`),
    INDEX `CoachTraining_courseId_idx`(`courseId`),
    UNIQUE INDEX `CoachTraining_coachId_courseId_key`(`coachId`, `courseId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TrainingEvent` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `maxParticipants` INTEGER NOT NULL,
    `registrationEndDate` DATETIME(3) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EventParticipant` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `eventId` INTEGER NOT NULL,
    `coachId` INTEGER NOT NULL,
    `registrationDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `isAttended` BOOLEAN NOT NULL DEFAULT false,
    `notes` TEXT NULL,

    INDEX `EventParticipant_eventId_idx`(`eventId`),
    INDEX `EventParticipant_coachId_idx`(`coachId`),
    UNIQUE INDEX `EventParticipant_eventId_coachId_key`(`eventId`, `coachId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `BatchParticipant` ADD CONSTRAINT `BatchParticipant_batchId_fkey` FOREIGN KEY (`batchId`) REFERENCES `TrainingBatch`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BatchParticipant` ADD CONSTRAINT `BatchParticipant_coachId_fkey` FOREIGN KEY (`coachId`) REFERENCES `Coach`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Coach` ADD CONSTRAINT `Coach_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Coach` ADD CONSTRAINT `Coach_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `Location`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CoachTraining` ADD CONSTRAINT `CoachTraining_coachId_fkey` FOREIGN KEY (`coachId`) REFERENCES `Coach`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CoachTraining` ADD CONSTRAINT `CoachTraining_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `TrainingCourse`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EventParticipant` ADD CONSTRAINT `EventParticipant_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `TrainingEvent`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EventParticipant` ADD CONSTRAINT `EventParticipant_coachId_fkey` FOREIGN KEY (`coachId`) REFERENCES `Coach`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
