# Guide

## Active Effects API

### Creating Active Effects

### Deleting Active Effects
To delete an active effect call the Documents `delete(operation={})` function. This will cause the ActiveEffects _onDelete() functions to propogate through the inheritance chain and the document to be removed.
`myActiveEffectInstance.delete(operation={})`

### Toggling Active Effects ON/OFF
You can disable effects by calling the Document `async update(data={}, operation={})` function on the ActiveEffects instance and passing an object targeting its disabled property. For example getting the first element from an actor and disabling it.

This will trigger the _onUpdate() function to propogate up the ActiveEffects inheritance chain until it disables it.

myActiveEffectInstance.update({disabled:true | false})

Example:
fromUuidSync('Actor.Vcld2aYB5E9uPSdi').appliedEffects[0].update({disabled:true})