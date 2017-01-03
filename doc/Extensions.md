# Extensions

Extensions allow users to customize their app experience without depending on the app's core developer. For example, suppose many users demanded an "export to PDF" feature in a notes app built on top of Standard File. The developer of the notes app does not wish to implement this feature, as it would make the codebase larger, more complex, and less sustainabile, and would rather keep just the essentials.

Instead, an outside developer can decide to build a "Export to PDF" extension. Any app that supports extensions can now support Export to PDF functionality without needing to build it themselves, or even understand how it works.

## Specification
The core interface of an extension is a primary URL that supports GET requests. An extension developer can implement an extension system however they choose, as long as the end result is a URL the end user can plug in to applications.

When a user enters the URL into the client application, the client will perform a GET request to that URL. The server will return actions available to the extension.

GET extension_url

Params: 

- item_uuid (optional)
- content_type (required if item_uuid supplied, otherwise optional. The content_type of the item. The server can use this to determine if this content type is supported by this extension.)

Response: 

The extension's name, supported content types, and:

-  If content_type or item_uuid was provided in the params, then the response will be an array of Actions that apply to this item or this item type (nested under "actions").

Action model:

An action model has the following fields:

- label: what should be displayed to the user.
- url: the URL the app should perform
- type: the type of the URL action. This could be one of ["get", "post", "show", "delete"]. `show` opens the URL in a browser. The rest are API requests.
- params: an array of paramters that should be sent with the request. This field typically makes sense only in the context of an Item, in which case certain properties of the Item can be requested. For `content` properties, the requested paramters should be a key path: `["uuid", "created_at", "content.title", "content.references"]`. All fields should be sent decrypted.
- modifies: an array of fields and modification_type that this action modifies:
```
  [ 
	  {
	  "name" : "content.title",
	  "type" : "replace"
	  }
  ]
```

Upon completion of this action, apps should either merge or append the values of keys present in this array. In this example, after the app performs this action and receives a response, it should merge or append the values of the response for these keys with the local model, and then sync data with user's server.

The app should display this list of actions and perform the respective URL of that action upon selection. 

### Example

Let's try an example with a "Calculate Average" extension that calculates the mean of numbers in a Note structure.

As an extension developer, I set up a simple server that can generate unique URLS and also respond to them. I also put up a small landing page:

___ 
_Welcome to my extension! Use this URL in your app to install this extension_

**https://myextension.me/note/calcaverage**
___

Now, as a user, I'll copy that URL and paste it into the main client.

The client performs a GET request to https://myextension.me/calcaverage with parameters `{content_type: "Note"}` and receives a response:

```
{
	"name" : "Average Calculator",
	"supported_types" : [ "Note" ],
	"actions" : [
		{
			"label" : "Calculate Average",
			"url" : "https://myextension.me/calcaverage",
			"type" : "post",
			"required_params" : ["content_type", "content.text"],
			"modifies" : [
				{
				"name" : "content.text",
				"type" : "insert"
				}
			]
		}
	]
}
```

The client now displays this action.

The user clicks on "Calculate Average".

The client will perform a POST request:
URL: https://myextension.me/calcaverage
Params: {"content.text" : "1, 3, 5, 7, 11, 13, 17, 19, 23, 29"}

Client receives response JSON:

```
{"content.text" : "The average is: 12.8"}
```

Since the original action modification type was "insert", we'll insert this result to this Note's content.text field and sync.


### Another example

Let's do another example where we have a FileAttachment extension.

As an extention developer, I'll build a website that can handle user registration and sign in. When a user registers, I'll provider the user with a unique, secret URL that identifies their account:

> https://fileattacher.me/extension/jfd9r3ajfht478f

Next, as a user, I'll enter this URL into the main app.

The client app performs a GET request to https://fileattacher.me/extension/jfd9r3ajfht478f without any paramters and receives a response:

```
{
	"name" : "File Attacher",
	"supported_types" : [ "Note" ]
}
```

Because this extension supports the Note type, the app will display this extension in the extensions section of any Note item.

Next, as a user, I select a note. I click on "Extensions" in the menu bar. The client now performs a GET request to the extension's URL in order to retreive available actions for this item.

GET https://fileattacher.me/extension/jfd9r3ajfht478f
Params: `{"item_uuid" : "439ecf9b-788f-470f-9559-65ac5179981a", "content_type" : "Note}`

Response:

```
{
	"name" : "File Attacher",
	"supported_types" : [ "Note" ],
	"actions" : [
		{
			"label" : "Attach new file",
			"url" : "https://fileattacher.me/extension/jfd9r3ajfht478f/439ecf9b-788f-470f-9559-65ac5179981a/attach",
			"type" : "show",
			"required_params" : nil,
			"modifies" : nil
		}
	]
}
```
The client now displays this action.

When the user selects "Attach new file", the client app notices the `type` field is `show`, so it will simply open that URL with the user's default browser. The browser now loads the extension's website via the unique URL and shows an "Add attachment" button. The user proceeds to add an attachment titled "Expenses(1).pdf", and closes the window.

The user re-opens the extension menu in the main app. The client performs the same GET request to the extension's URL with the item's UUID and content_type to reload the available actions, and receives the following response:

```
{
	"name" : "File Attacher",
	"supported_types" : [ "Note" ],
	"actions" : [
		{
			"label" : "Attach new file",
			"url" : "https://fileattacher.me/extension/jfd9r3ajfht478f/439ecf9b-788f-470f-9559-65ac5179981a/attach",
			"type" : "show",
			"required_params" : nil,
			"modifies" : nil
		},
		{
			"label" : "Download Expenses(1).pdf",
			"url" : "https://fileattacher.me/extension/jfd9r3ajfht478f/439ecf9b-788f-470f-9559-65ac5179981a/download/i39fe9fj4d",
			"type" : "show",
			"required_params" : nil,
			"modifies" : nil
		}
	]
}
```

The client app now displays both these actions, and the user can download the attachment they uploaded via the second action.
