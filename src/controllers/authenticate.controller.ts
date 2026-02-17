// import { PrismaService } from "src/prisma/prisma.service";
// import { ConflictException, UsePipes } from "@nestjs/common";
import { Controller, Post } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
// import { hash } from "bcryptjs";
// import { ZodValidationPipe } from "src/pipes/zod-validation-pipe";
// import { z } from "zod";

// const createAccountSchema = z.object({
//   name: z.string(),
//   email: z.email(),
//   password: z.string(),
// });

// type CreateAccountSchema = z.infer<typeof createAccountSchema>;

@Controller("/sessions")
export class AuthenticateController {
  constructor(private jwt: JwtService) {}

  @Post()
  // @UsePipes(new ZodValidationPipe(createAccountSchema))
  async handle() {
    const token = this.jwt.sign({ sub: "user-id" });

    return token;
  }
}
