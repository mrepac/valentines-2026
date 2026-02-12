import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const imagesDirectory = path.join(process.cwd(), 'public', 'images')
    
    // Check if directory exists
    if (!fs.existsSync(imagesDirectory)) {
      return NextResponse.json({ images: [] })
    }

    // Read directory
    const files = fs.readdirSync(imagesDirectory)
    
    // Filter for image files (exclude HEIC, prefer PNG if both exist)
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
    const imageFiles = files
      .filter(file => {
        const ext = path.extname(file).toLowerCase()
        const baseName = file.toLowerCase()
        // Exclude HEIC files and .gitkeep
        if (baseName.endsWith('.heic') || file === '.gitkeep') {
          return false
        }
        // If PNG exists, exclude corresponding HEIC
        if (baseName.endsWith('.png')) {
          const heicName = baseName.replace('.png', '.heic')
          if (files.some(f => f.toLowerCase() === heicName)) {
            return true // Include PNG
          }
        }
        return imageExtensions.includes(ext)
      })
      .map(file => `/images/${file}`)
      .sort()

    return NextResponse.json({ images: imageFiles })
  } catch (error) {
    console.error('Error reading images:', error)
    return NextResponse.json({ images: [] }, { status: 500 })
  }
}
