
# TodoMVC

 A [todomvc](http://todomvc.com) implementation using [jsiom](//github.com/jsiom/app). To run it just clone the repo and run `make`

## Analysis

Jsiom enabled me to write this app in a declarative style which is obviously a massive win over the normal explicitly mutative style I'm used to. Not only was it easier to write but the end result is actually better. For example in the render function I declared that if no todos are currently being edited then the cursor should be in the todo creation box otherwise it should be in the todo that is being edited and automatically this meant that when the user finishes editing a todo the cursor will go back to the todo creation box. Normally this would of been an explicit feature. Also whenever the user closes the window and later opens it again it will return to the exact state it was last in. Even down to putting the cursor in a todo if they were in the middle of editing one. Plus accidental page refreshes are completely harmless which is a nice feature for users. Also a really nice undo/redo was super easy to implement and it could even be persisted across page refreshes. That feature would be ridiculously hard to implement in the mutative style of programming.

And perhaps surprisingly page load is really really fast. Actually faster than the [vanillajs](http://todomvc.com/examples/vanillajs) implementation since it doesn't mutate the DOM while rendering. So the browser doesn't have to keep re-rendering the interface during initialization. Declarative programming was all win for this particular application though I think it would be interesting to see how a more interaction heavy application would turn out. I suspect it could take a bit of experimentation to find an approach which isn't worse in some way compared to the explicit mutation approach. Most probably it will only be a performance issue but will be interesting to see. I think animations could be much nicer in the declarative approach however since it will remove the need to explicitly cancel animations that get canceled before they complete.

## Todo

* Optimization: JSIOM is fast enough for this app and probably most apps but there is still enormous potential for optimization. It should be possible to remove almost all diffing overhead

* Style: Replace CSS with something sensible. I think its nice to keep the styling out of sight and out of mind while your writing the app's logic but CSS is pretty cryptic and non-modular

* Animation/Interaction: A good way to test this out would be to implement todo list re-ordering by drag and drop
