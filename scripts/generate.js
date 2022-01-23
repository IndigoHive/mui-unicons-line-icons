const fs = require('fs')
const prettifyXml = require('prettify-xml')
const { pascalCase } = require('change-case')

const filenames = fs.readdirSync('./svg')

function processFile (filename) {
  const filepath = './svg/' + filename
  const buffer = fs.readFileSync(filepath)

  const content = buffer.toString()
  const pretty = prettifyXml(content).replace(/\/\>/g, ' />').replace(/enable-background/g, 'enableBackground')
  const colorless = pretty.replace(/fill="#......" /g, '')
  const withoutSvg = colorless.split('\n')
  withoutSvg.pop()
  withoutSvg.shift()
  const indented = '    ' + withoutSvg.join('\n    ')

  let file = 'Uil' + pascalCase(filename.split('.')[0]).replace(/_/g, '')
  const outputpath = './components/' + file + '.tsx'
  fs.writeFileSync(outputpath, getOutput(file, indented))
}

function getOutput (name, svg) {
  return (`import React from 'react'
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon'

export default function ${name} (props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
${svg}
    </SvgIcon>
  )
}
`)
}

if (!fs.existsSync('./components')){
  fs.mkdirSync('./components');
}

for (let i = 0; i < filenames.length; i++) {
  processFile(filenames[i])
}
