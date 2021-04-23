const ONE_KB = 1000

const getIntFromEnv = (key: string, defatulValue: number): number =>
  parseInt(process.env[key] || '') || defatulValue

const maxFiles = getIntFromEnv('NEXT_PUBLIC_MAX_COUNT_UPLOAD', 30)
const minFiles = getIntFromEnv('NEXT_PUBLIC_MAX_COUNT_UPLOAD', 5)
const maxSize = getIntFromEnv('NEXT_PUBLIC_MAX_SIZE_UPLOAD', 5000 * ONE_KB)

const config = {
  MAX_FILES: maxFiles,
  MIN_FILES: minFiles,
  MAX_FILE_SIZE: maxSize,
  fileConstraints: {
    MIN_WIDTH: getIntFromEnv('NEXT_PUBLIC_FILE_CONSTRAINT_MIN_WIDTH', 500),
    MAX_WIDTH: getIntFromEnv('NEXT_PUBLIC_FILE_CONSTRAINT_MAX_WIDTH', 2200),
    MIN_HEIGHT: getIntFromEnv('NEXT_PUBLIC_FILE_CONSTRAINT_MIN_HEIGHT', 500),
    MAX_HEIGHT: getIntFromEnv('NEXT_PUBLIC_FILE_CONSTRAINT_MAX_HEIGHT', 3000),
  },
}

export default config
