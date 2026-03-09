import { existsSync, rename } from 'fs'
import { basename, join, normalize, resolve } from 'path'

function movingFile(imagePath: string, from: string, to: string) {
    const fileName = basename(imagePath)

    if (
        fileName.includes('..') ||
        fileName.includes('/') ||
        fileName.includes('\\')
    ) {
        throw new Error('Недопустимое имя файла')
    }

    const imagePathTemp = resolve(normalize(join(from, fileName)))
    const imagePathPermanent = resolve(normalize(join(to, fileName)))

    const resolvedFrom = resolve(normalize(from))
    const resolvedTo = resolve(normalize(to))

    if (!imagePathTemp.startsWith(resolvedFrom)) {
        throw new Error('Недопустимый путь источника')
    }

    if (!imagePathPermanent.startsWith(resolvedTo)) {
        throw new Error('Недопустимый путь назначения')
    }

    if (!existsSync(imagePathTemp)) {
        throw new Error('Ошибка при сохранении файла')
    }

    rename(imagePathTemp, imagePathPermanent, (err) => {
        if (err) {
            throw new Error('Ошибка при сохранении файла')
        }
    })
}

export default movingFile
