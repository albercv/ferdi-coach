import { randomUUID } from "node:crypto"
import fs from "node:fs/promises"
import { spawn } from "node:child_process"
import path from "node:path"
import os from "node:os"

const FFMPEG_BIN = process.env.FFMPEG_BIN ?? "/usr/bin/ffmpeg"
const TRANSCODE_TIMEOUT_MS = 300_000

export async function transcodeToMp4(input: {
  bytes: Uint8Array
  inputExt: string
}): Promise<Uint8Array> {
  const id = randomUUID()
  const inPath = path.join(os.tmpdir(), `${id}-in.${input.inputExt}`)
  const outPath = path.join(os.tmpdir(), `${id}-out.mp4`)

  try {
    await fs.writeFile(inPath, input.bytes)

    const transcoded = await runFfmpeg(inPath, outPath)
    return transcoded
  } finally {
    await cleanupFile(inPath)
    await cleanupFile(outPath)
  }
}

function runFfmpeg(inPath: string, outPath: string): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const controller = new AbortController()
    const timer = setTimeout(() => {
      controller.abort()
      child.kill("SIGKILL")
      reject(new Error("TRANSCODE_FAILED: timeout exceeded"))
    }, TRANSCODE_TIMEOUT_MS)

    const args = [
      "-i", inPath,
      "-c:v", "libx264",
      "-preset", "fast",
      "-crf", "23",
      "-c:a", "aac",
      "-b:a", "128k",
      "-movflags", "+faststart",
      "-threads", "2",
      "-y",
      outPath,
    ]

    const child = spawn(FFMPEG_BIN, args)

    const stderrChunks: Buffer[] = []
    child.stderr.on("data", (chunk: Buffer) => stderrChunks.push(chunk))

    child.on("error", (err) => {
      clearTimeout(timer)
      console.error("[media][transcode] spawn error", err)
      reject(new Error(`TRANSCODE_FAILED: ${err.message}`))
    })

    child.on("close", async (code) => {
      clearTimeout(timer)

      if (code !== 0) {
        const stderrTail = Buffer.concat(stderrChunks).toString("utf8").slice(-500)
        console.error("[media][transcode] ffmpeg exit", code, stderrTail)
        reject(new Error(`TRANSCODE_FAILED: ${stderrTail}`))
        return
      }

      try {
        const buf = await fs.readFile(outPath)
        resolve(new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength))
      } catch (err) {
        console.error("[media][transcode] read output error", err)
        reject(new Error("TRANSCODE_FAILED: could not read output file"))
      }
    })
  })
}

async function cleanupFile(filePath: string): Promise<void> {
  try {
    await fs.unlink(filePath)
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") {
      console.error("[media][transcode] cleanup error", filePath, err)
    }
  }
}
