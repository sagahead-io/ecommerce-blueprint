export const authHandle = async (_, document, ctx, service) => {
  console.log('called document', document.definitions[0].selectionSet)
  console.log('called document[0]', document.definitions[0].name)
  console.log('called service', service)
  ctx.testas = '10'
  return {
    document,
  }
}
