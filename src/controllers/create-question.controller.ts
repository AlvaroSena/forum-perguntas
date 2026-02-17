import { PrismaService } from "src/prisma/prisma.service";
import { Controller, Post, Body, UseGuards } from "@nestjs/common";
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe";
import { z } from "zod";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { CurrentUser } from "src/auth/current-user-decorator";
import type { UserPayload } from "src/auth/jwt.strategy";

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
});

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>;

@Controller("/questions")
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(new ZodValidationPipe(createQuestionBodySchema)) body: CreateQuestionBodySchema,
  ) {
    const { title, content } = body;
    const { sub: authorId } = user;

    const slug = this.slugify(title);

    await this.prisma.question.create({
      data: {
        title,
        content,
        authorId,
        slug,
      },
    });
  }

  private slugify(title: string): string {
    return (
      title
        .toLowerCase()
        .trim()
        // Remove accents/diacritics
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        // Remove invalid chars
        .replace(/[^a-z0-9\s-]/g, "")
        // Replace whitespace with hyphen
        .replace(/\s+/g, "-")
        // Remove multiple hyphens
        .replace(/-+/g, "-")
    );
  }
}
