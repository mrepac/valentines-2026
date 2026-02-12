const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const imagesDir = path.join(__dirname, '..', 'public', 'images')

async function convertHeicToPng() {
  try {
    const files = fs.readdirSync(imagesDir)
    const heicFiles = files.filter(file => 
      file.toLowerCase().endsWith('.heic') || file.toLowerCase().endsWith('.HEIC')
    )

    if (heicFiles.length === 0) {
      console.log('No HEIC files found')
      return
    }

    console.log(`Found ${heicFiles.length} HEIC file(s) to convert...`)

    for (const heicFile of heicFiles) {
      const heicPath = path.join(imagesDir, heicFile)
      const pngFile = heicFile.replace(/\.heic$/i, '.png')
      const pngPath = path.join(imagesDir, pngFile)

      if (fs.existsSync(pngPath)) {
        console.log(`✓ ${pngFile} already exists, skipping ${heicFile}`)
        continue
      }

      try {
        console.log(`Converting ${heicFile} to ${pngFile}...`)
        await sharp(heicPath)
          .png()
          .toFile(pngPath)
        console.log(`✓ Successfully converted ${heicFile} to ${pngFile}`)
      } catch (error) {
        console.error(`✗ Error converting ${heicFile}:`, error.message)
      }
    }

    console.log('Conversion complete!')
  } catch (error) {
    console.error('Error:', error)
  }
}

convertHeicToPng()
