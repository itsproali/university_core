import { PrismaClient } from "@prisma/client";
import {
  DefaultArgs,
  PrismaClientOptions,
} from "@prisma/client/runtime/library";

type PayloadProps = {
  studentId: string;
  academicSemesterId: string;
  totalPaymentAmount: number;
};

const createSemesterPayment = async (
  tx: Omit<
    PrismaClient<PrismaClientOptions, never, DefaultArgs>,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
  >,
  { studentId, academicSemesterId, totalPaymentAmount }: PayloadProps
) => {
  const isExist = await tx.studentSemesterPayment.findFirst({
    where: {
      studentId,
      academicSemesterId,
    },
  });

  if (!isExist) {
    const data = {
      studentId,
      academicSemesterId,
      fullPaymentAmount: totalPaymentAmount,
      partialPaymentAmount: totalPaymentAmount * 0.5,
      totalDueAmount: totalPaymentAmount,
      totalPaidAmount: 0,
    };
    await tx.studentSemesterPayment.create({
      data,
    });
  }
};

export const studentSemesterPaymentService = {
  createSemesterPayment,
};
