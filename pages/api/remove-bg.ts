import { IncomingForm } from 'formidable'
import fs from 'fs'
import FormData from 'form-data'
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

export const config = {
    api: {
        bodyParser: false,
    },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).end()
    }

    const form = new IncomingForm()

    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error(err)
            return res.status(500).json({ error: 'Form parse error' })
        }

        const file = Array.isArray(files.image) ? files.image[0] : files.image
        if (!file) {
            return res.status(400).json({ error: 'No image uploaded' })
        }
        console.log('uploaded file:', file)

        // ファイルバッファを読み込み
        const buffer = fs.readFileSync(file.filepath)
        const formData = new FormData()
        formData.append('image_file', buffer, {
            filename: file.originalFilename || 'image.png',
            contentType: file.mimetype || 'image/jpeg',
        })
        formData.append('size', 'auto')

        const response = await axios.post('https://api.remove.bg/v1.0/removebg', formData, {
            headers: {
                'X-Api-Key': process.env.REMOVE_BG_API_KEY!,
                ...formData.getHeaders(),
            },
            responseType: 'arraybuffer',
        })

        res.setHeader('Content-Type', 'image/png')
        res.send(response.data)
    })
}
