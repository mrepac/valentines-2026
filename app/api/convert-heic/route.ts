import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

export async function POST(request: Request) {
  try {
    const { filename } = await request.json()
    
    if (!filename) {
      return NextResponse.json({ error: 'Filename required' }, { status: 400 })
    }

    const imagesDirectory = path.join(process.cwd(), 'public', 'images')
    const heicPath = path.join(imagesDirectory, filename)
    const pngPath = path.join(imagesDirectory, filename.replace(/\.heic$/i, '.png'))

    // Check if HEIC file exists
    if (!fs.existsSync(heicPath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    // Check if PNG already exists
    if (fs.existsSync(pngPath)) {
      return NextResponse.json({ 
        success: true, 
        filename: path.basename(pngPath),
        message: 'PNG already exists' 
      })
    }

    // Convert HEIC to PNG
    await sharp(heicPath)
      .png()
      .toFile(pngPath)

    return NextResponse.json({ 
      success: true, 
      filename: path.basename(pngPath) 
    })
  } catch (error) {
    console.error('Error converting HEIC:', error)
    return NextResponse.json({ 
      error: 'Conversion failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
