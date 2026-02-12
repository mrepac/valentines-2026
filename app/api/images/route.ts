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
    
    // Filter for image files
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
    const imageFiles = files
      .filter(file => {
        const ext = path.extname(file).toLowerCase()
        // Exclude .gitkeep and non-image files
        return file !== '.gitkeep' && imageExtensions.includes(ext)
      })
      .map(file => `/images/${file}`)
      .sort()

    return NextResponse.json({ images: imageFiles })
  } catch (error) {
    console.error('Error reading images:', error)
    return NextResponse.json({ images: [] }, { status: 500 })
  }
}
