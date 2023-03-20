const { onEditContentInEditor } = require('../src/editContentInEditor')

onEditContentInEditor('./sandbox/test.txt', async (content) => {
  return content.split('').reverse().join('')
})
