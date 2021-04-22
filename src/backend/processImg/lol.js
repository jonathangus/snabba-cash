const AWS = require('aws-sdk')
const path = require('path')
const fs = require('fs')
const unzipper = require('unzipper')

const init = async () => {
  const outputFolder = path.join(process.cwd(), 'hej')
  const zip = await fs
    .createReadStream(path.join(process.cwd(), 'lol.zip'))
    .pipe(unzipper.Extract({ path: outputFolder }))
    .promise()

  console.log('done')

  fs.readdirSync(outputFolder).forEach((file) => {
    console.log(file)
  })
}
init()
