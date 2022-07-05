import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileDto } from '../dto/file.dto';
import { AuthorizedRequest } from '../infra/http/authorized-request';
import { SongsService } from './songs.service';

@Controller('songs')
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @UseInterceptors(FileInterceptor('song'))
  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @HttpCode(HttpStatus.CREATED)
  async upload(
    @Request() req: AuthorizedRequest,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const fileDto = new FileDto(file.originalname, file.mimetype, file.buffer);

    return this.songsService.upload(req.user.userId, fileDto);
  }

  // @Get('stream/:id')
  // getSong(
  //   @Response({ passthrough: true }) res,
  //   @Param('id') id: number,
  // ): StreamableFile {
  //   const fileName = '1657018975080-Death - Voice of the Soul.mp3';
  //   const filePath = join(process.cwd(), 'tmp', fileName);

  //   const file = createReadStream(filePath);

  //   res.set({
  //     'Content-Type': 'audio/mpeg',
  //     'Accept-Ranges': 'bytes',
  //     'Content-Disposition': `attachment; filename="${fileName}"`,
  //   });

  //   return new StreamableFile(file);
  // }
}
