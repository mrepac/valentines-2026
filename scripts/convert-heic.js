const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const imagesDir = path.join(__dirname, '..', 'public', 'images')

function convertHeicToPng() {
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
    console.log('\nNote: HEIC conversion requires sips (macOS) or ImageMagick')
    console.log('For macOS, you can use: sips -s format png input.HEIC --out output.png\n')

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
        
        // Try using sips on macOS
        if (process.platform === 'darwin') {
          try {
            execSync(`sips -s format png "${heicPath}" --out "${pngPath}"`, { 
              stdio: 'pipe',
              encoding: 'utf8'
            })
            // Verify the file was created and has content
            if (fs.existsSync(pngPath) && fs.statSync(pngPath).size > 0) {
              console.log(`✓ Successfully converted ${heicFile} to ${pngFile}`)
            } else {
              throw new Error('Conversion produced empty file')
            }
          } catch (sipsError) {
            console.error(`✗ Error converting ${heicFile} with sips:`, sipsError.message)
            console.error(`  Please convert manually: sips -s format png "${heicPath}" --out "${pngPath}"`)
          }
        } else {
          console.error(`✗ Automatic conversion not available on ${process.platform}`)
          console.error(`  Please convert ${heicFile} to PNG manually`)
        }
      } catch (error) {
        console.error(`✗ Error converting ${heicFile}:`, error.message)
      }
    }

    console.log('\nConversion complete!')
  } catch (error) {
    console.error('Error:', error)
  }
}

convertHeicToPng()
