<h1><a id='intro'></a> Intro </h1>

Many of us today are digital nomads: we go from app to app, service to service, looking for the best solution. And since most "solutions" are proprietary, we often have to say goodbye to our old data, or manually and painstakingly transfer it over.

Standard File is one account for every human. This account can store almost any data type, and supports strong encryption and privacy by default.

Why would you want a Standard File account?

1. **Convenience**. You don't have to manage hundreds of different accounts, and worry about backups if one of those services go offline. Your one Standard File account manages all your data across all application that supports the Standard File format.
1. **Data lifetime**. The Standard File format is a growth-resistant format. Because it is a generalized and abstracted system, it can handle almost any application type without needing to change the data format on the server. This means your data is always easy to parse by applications, and because the format is simple, it makes it easy for new developers to create new applications that parse your data and offer new utilities on top of this data.
2. **More choices**. Today, when a company offers a service that's useful, it's hard to move to something else, even if you really want to. The Standard File system allows app developers to focus on creating great applications, without having to worry about managing servers. This means a richer ecosystem of great applications that don't lock you in.
3. **Security**. All apps that use the Standard File system are required to encrypt data locally before sending that data to the server. This means that servers do not have to be trusted. In fact, even if your data was stolen from a hacked server, that data would be unreadable and useless to an attacker.
4. **Privacy**. You can choose any Standard File hosting provider, or run a Standard File server of your own. Because the choice is yours, you can always go with the provider that promises the highest level of privacy. And if ultimately that isn't enough for you, you can easily run your own Standard File system for 100% privacy control.


<h2><a id='getting-started'></a>Getting Started</h2>

To get started with a Standard File account, find [apps](https://standardnotes.org) that support the Standard File format.

These apps will ask you for a Standard File server location. You can use any of these free servers:

https://n1.standardfile.org

https://n3.standardfile.org.uk

Simply register for a Standard File account using one of the available apps.

*Note that because your data is encrypted before being stored in the server above, you don't have to trust the server. Your data is secure by default.*

<h2><a id='developers'></a>Developers</h2>

To build a quality application, most app developers today have to implement not only their own front-end clients, but also a backend architecture to handle model storage for their specific schema. With the growing trend of 'experimental' and 'single-use' applications, which frequently make their rounds on sites like Product Hunt, it becomes impractical to build a new server infrastructure for every application.

Standard File makes use of progressions in consumer device performance and capacity. Handheld client devices such as smartphones today are more powerful than server architectures decades ago. And while it may have made sense back then to let the server handle all model and business logic for an application, today clients are plenty powerful to do this on their own.

This is the paradigm that Standard File relies on, which allows for "server" related code to be handled by the client device instead. Because data logic is handled by the client device, this means end-to-end encryption can also come standard. The server is treated as a dummy model store, without knowledge of the contents.

One can build any client application with the same Standard File server.

The future vision of Standard File is for every person to have their own Standard File server, whether shared or private, that allows them to use one account for all their data, across multiple clients that offer different utilities. For example, one client could be a notes app. Another could be a desktop file sync. And yet another could be a photos manager. All these apps could be built off the same Standard File server. This makes it so that developers don't have to worry about building a secure back end system, and so that end users don't have to worry about data security and ownership.

Today, [a robust notes system](https://standardnotes.org) has already been built on top of Standard File.

# Protocol Specification

**Version 0.0.1**

While most protocol specifications are hard to read and unnecessarily complex, Standard File aims to be a simple system that any developer can understand and implement.

<h2><a id='implementations'></a>Implementations</h2>

[Ruby Server Implementation](https://github.com/standardnotes/ruby-server)


<h2><a id='introduction'></a>Introduction</h2>

This document outlines the specifications for the client-server communications of the Standard File system. Any client can communicate with a Standard File server as long as it understands the server's requirements.

<h2><a id='models'></a>Models</h2>

The protocol consists of models on the server side and what are known as structures on the client side.

**Server Models**

*   User
*   Item

**Client Structures**

*   *Arbitrary*

An `Item` model has a `content` field. The `content` field stores a JSON encoded object that can be any thing the client needs to operate. There are proposed standards for structures (such as Notes and Tags used by the Standard Notes application suite).

In this client-server model, servers are to be treated as dumb and uninformed. Because data is encrypted anyway, maintaining relationships between server side models is not very useful.

The SF model pushes relationship mapping to the client, which clients today have no problem handling. This allows for improvements to be made to the data model on the client level, and not on the difficult-to-change server level.

## Server Models

All server models must have the following properties:

| name | type | description |
| --- | --- | --- |
| uuid | String (or uuid for some databases) | The unique identifier for this model. |

<h1><a id='user'></a>User</h1>

A user model has the following properties:

| name | type | description |
| --- | --- | --- |
| email | Integer | The email of the user. |
| password | String | The password for this user. _Note that passwords must be manipulated before being sent to the server. See here._ |
| username (_optional_) | String | A unique username used for sharing items. For servers that manage multiple Users, the username serves as a way to namespace presentations. |
| pw_function | String | The key derivation function (KDF) for this user. See Encryption for more. |
| pw_alg | String | The algorithm to use for the key derivation function. See Encryption for more. |
| pw_cost | String | The number of iterations to use for the KDF. See Encryption for more. |
| pw_key_size | Integer | The output key size of the KDF. See Encryption for more. |
| pw_nonce | String | A random string generated by the client during registration to compute the password salt. See Encryption for more. |

<h1><a id='items'></a>Items</h1>

Item models have the following properties:

| name | type | description |
| --- | --- | --- |
| content | Text (Base64) | The JSON string encoded structure of the note, encrypted (with some exceptions. See Sharing for details). |
| content_type | String | The type of the structure contained in the `content` field. |
| enc_item_key | String (Base64) | The locally encrypted encryption key for this item. |
| auth_hash | String (Hex) | The HMAC authentication hash for the encrypted content of this item. |
| presentation_name | String | The name of this presentation, if applicable. (See Sharing for details). |
| created_at | Date | The date this item was created. |
| updated_at | Date | The date this item was modified. |

## Client Structures

Client structures are stored in the `content` field of the `Item` model. All client structures have the following properties:

| name | type | description |
| --- | --- | --- |
| references | Array | A metadata array of other `Item` uuids this model is related to and their respective `content_type`. See sample below.

`references` array sample:

```
[
  {uuid: xxxx, content_type: "Tag"},
  {uuid: xxxxx, content_type: "Tag"},
]
```


<h1><a id='api'></a>REST API</h1>

General:

1.  All requests after the initial authentication should be authenticated with a JWT with the `Authorization` header:

    ```
    Authorization: Bearer _insert_JWT_here_

    ```

<h1><a id='api-auth'></a>Auth</h1>

Standard File uses JSON Web Tokens (JWT) for authentication.

#### POST auth

**Registers a user and returns a JWT**

*Params: email, password, pw_func, pw_alg, pw_key_size, pw_cost, pw_nonce*

*Note*: Passwords needs to be processed locally before being sent to the server. See Encryption for more. Never send the user's inputted password to the server.

Responses

`200`

```
{"jwt" : "..."}
```

`5xx`

```
{"errors" : []}
```

#### PATCH auth
**Updates a user's password.**

*Params: email, password, password_confirmation, current_password*

Responses
`204`

```
No Content
```

5xx

```
{"errors" : []}
```

#### POST auth/sign_in
**Authenticates a user and returns a JWT.**

*Note*: Passwords needs to be processed locally before being sent to the server. See Encryption for more. Never send the user's inputted password to the server.

*Params: email, password*

Responses
200

```
{"jwt" : "..."}
```

5xx

```
{"errors" : []}
```

#### GET auth/params
**Returns the parameters used for password generation.**

*Params: email*

Responses
200

```
{"pw_function" : "...", "pw_alg" : "...", "pw_cost" : "...", "pw_key_size" : "...", "pw_salt" : "..."}
```

5xx

```
{"errors" : []}
```

<h1><a id='api-users'></a>Users</h1>

#### GET users/me
**Returns the current user as well as all the user's items.**

*Params:*

Responses

200

```
{"email" : "...", "items" : []}
```

5xx

```
{"errors" : []}
```

<h1><a id='api-items'></a>Items</h1>

#### GET items
**Gets all items for current user.**

*Params: updated_after  — Optional. Return only items modified after a certain date.*

Responses

200

```
{"items" : []}
```

5xx

```
{"errors" : []}
```

#### GET items/:id
**Gets a particular item.**

*Params:*

Responses

200

```
{"item" : {}}
```

5xx

```
{"errors" : []}
```

#### POST items
**Creates or updates an item. This endpoint must be able to handle both a single item or an array of items. If the item doesn't exist, it should be created.**

*Params: item or items  — A single item or an array of items*

Responses

200

```
{"items" : {}}
```

5xx

```
{"errors" : []}
```

#### DELETE items/:id
**Deletes an item.**

*Params:*

Responses

204

```
No Content

```

5xx

```
{"errors" : []}
```

<h1><a id='import-export'></a>Import/Export</h1>

The export file is a JSON file of all the user's items, unencrypted.

**Format:**

```
{
  "items": [
    {
      "uuid": "3162fe3a-1b5b-4cf5-b88a-afcb9996b23a",
      "content_type": "Note",
      "presentation_name": null,
      "content": {
        "references": [
          {
            "uuid": "901751a0-0b85-4636-93a3-682c4779b634",
            "content_type": "Tag"
          },
          {
            "uuid": "023112fe-9066-481e-8a63-f15f27d3f904",
            "content_type": "Tag"
          }
        ],
        "title": "...",
        "text": "..."
      },
      "created_at": "2016-12-16T17:37:50.000Z"
    },

    {
      "uuid": "023112fe-9066-481e-8a63-f15f27d3f904",
      "content_type": "Tag",
      "presentation_name": "essays",
      "content": {
        "references": [
          {
            "uuid": "94cba6b7-6b55-41d6-89a5-e3db8be9fbbf",
            "content_type": "Note"
          },
          {
            "uuid": "ada3ff00-85fa-4427-a883-652a84736715",
            "content_type": "Note"
          },
          {
            "uuid": "3162fe3a-1b5b-4cf5-b88a-afcb9996b23a",
            "content_type": "Note"
          }
        ],
        "title": "essays"
      },
      "created_at": "2016-12-16T17:13:20.000Z"
    }
  ]
}
```

#### High-level flow, user wants to switch clients and servers:

1.  User chooses "Export" option on client A, which is paired with server A.
2.  Client produces JSON file with all items unencrypted.
3.  User uploads JSON file with client B paired with Server B.
4.  Client B iterates over items and encrypts the content of each of them locally. (Sharing exceptions apply, see Sharing.)
5.  Client B sends items (with encrypted item content) data to server B as normal POST request to `/items`.

<h1><a id='encryption'></a>Encryption</h1>

Encryption and security should always be top of mind with Standard File.

It is important that there exist a separation of concerns between the server and the client. That is, the client should not trust the server, and vice versa.

Encryption keys are generated by stretching the user's input password using a [key derivation function.](https://en.wikipedia.org/wiki/Key_derivation_function)

The resulting key is split in two — the first half is sent to the server as the user's password, and the second half is saved locally as the user's master encryption key. This way, the server can never compute the encryption key.

SF attempts to make no final judgement on the best key derivation function to use, and instead defers to clients to make this decision. This allows for a future-proof implementation that allows clients to adjust based on present-day security needs.

Note: client-server connections must be made securely through SSL/TLS.

#### Elaboration on User model encryption related fields

| name | details |
| --- | --- |
| pw_function | The key derivation function (KDF) to use. The current version of SN should only use PBKDF2, but this list can expand to use bcrypt, scrypt, or Argon2 in the future. |
| pw_alg | The hashing algorithm of the KDF. Clients should default to SHA512, but this can be changed depending on client cirumstances. |
| pw_cost | The number of iterations to be used by the KDF. On native platforms, this should be around 60,000\. However note that non-native clients (web clients not using WebCrypto) will not be able to handle any more than 5,000 iterations. |
| pw_key_size | The KDF output key size. This should match up with the output length of pw_alg. If you're using SHA512, then this value should be 512. |
| pw_nonce | A random string used to compute the password salt. This value is initially created by the client during registration, but should never be sent back to the client during future authentication calls. The server stores this to calculate the user's password salt. |

<h1><a id='key-generation'></a>Key Generation</h1>

### Client Instructions

Given a user inputted password `uip`, the client's job is to generate a password `pw` to send to the server as well as generate a master encryption key `mk` that the user stores locally to encrypt/decrypt data.

**Authentication Steps**

1.  Client makes GET request with user's email to `auth/params` to retrieve password function, algorithm, salt, cost, and key size.
2.  Client computes `pw` and `mk`:

    ```
    key = pw_function(uip, pw_salt, pw_alg, pw_key_size, pw_cost)
    pw = key.substring(0, key.length/2)
    mk = key.substring(key.length/2, key.length)
    ```

3.  Client sends `pw` to the server as the user's "regular" password and stores `mk` locally. (`mk` is never sent to the server).

**Registration Steps**

1.  Client chooses defaults for auth params (see Recommended Auth Params). Client also generates random string (at least 128 bits) as `pw_nonce`.
2.  Client computes `salt = SHA1:Hexdigest(email + "SN" + pw_nonce)`.
3.  Client computes `pw` and `mk` using step (2) from Authentication Steps, and registers with `email`, `pw`, and `pw_nonce`, as well as the chosen defaults for auth params.

### Server Instructions

The server must respond to GET requests made to `auth/params` and return the authentication parameters used for generating that user's password.

**Steps**

1.  Server performs search for user with email in request parameters.
    *   If user exists:
        *   Compute `pw_salt = SHA1:Hexdigest(user.email + "SN" + user.pw_nonce)`. Return `pw_salt` and user stored values for `pw_function`, `pw_alg`, `pw_cost`, and `pw_key_size`.
    *   If user doesn't exist:
        *   Compute `pw_salt = SHA1:Hexdigest(email + "SN" + SALT_PSEUDO_NONCE)`, where `SALT_PSEUDO_NONCE` is a static value stored by the server. This way, two consequent requests for a single email don't reveal whether this email is registered. Return `pw_salt` and recommended defaults for `pw_function`, `pw_alg`, `pw_cost`, and `pw_key_size`.

For more information on the salt generation scheme used here, see [here.](https://eprint.iacr.org/2015/387.pdf)

#### Recommended Auth Params

| Type | Value |
| --- | --- |
| Function | PBKDF2 |
| Algorithm | SHA512 |
| Cost | 60,000 |
| Key size | 512 |


<h1><a id='item-encryption'></a>Item Encryption</h1>

**Client-side**

An item is encrypted using a random key generated for each item.

**Encryption:**

Note that when encrypting/decrypting data, keys should be converted to the proper format your platform function supports. It's best to convert keys to binary data before running through any encryption/hashing algorithm.

As general rules:

1. Anything *encrypted* (using AES) is stored as base64.
2. Keys are stored as Hex.
3. Keys that are encrypted (using AES) are stored as base64.

For every item, if item is not public:

1.  Generate a random 512 bit key `item_key` (in hex format).
2.  Split `item_key` in half; set encryption key `ek = first half` and authentication key `ak = second half`.
3.  Encrypt `content` using AES-CBC-256:base64 and `ek` as the secret. Prepend the literal string "001" to the encoded string to indicate that it is encrypted.
4.  Compute `auth_hash = HMAC-SHA256:hex(base64-encrypted-content-string, ak)`.
5.  Encrypt `item_key` with user’s master key `mk`: `enc_item_key = AES-CBC-256.base64(item_key, mk)`.
6.  Send `content`, `enc_item_key`, and `auth_hash` to the server.

**If item is public or belongs to public item:**

1.  Set `enc_item_key` and `auth_hash` to null.
2.  Send `content` as a base64 encoded JSON string with the literal string "000" prepended to indicating it is not encrypted to the server.

**Decryption:**

Check the first 3 characters of the `content` string. If it is equal to "001", `content` is encrypted, and should be decrypted:

1.  Decrypt `enc_item_key` with AES-CBC-256:base64(enc_item_key, mk)` to get hex string `item_key`.
2.  Split `item_key` in half; set encryption key `ek = first half` and authentication key `ak = second half`.
3.  Verify authenticity of message by computing `auth_hash = HMAC-SHA256:hex(encrypted-content, ak)`. If this value matches the `auth_hash` value returned by the server for this item, then proceed. Otherwise, the encrypted content of this item has been tampered with.
4.  Decrypt content using `ek`.

**Server-side:**

For every received item:

1.  (Optional but recommended) Encrypt `content` using server known key and store. Decrypt before sending back to client.

<h1><a id='sharing'></a>Sharing/Publishing</h1>

When an item is shared, it is accessible by the public. To share an item, you set a value for `presentation_name` on the item.

When presenting, the client must remove local encryption from the item and all other referenced items the client deems related.

When un-presenting an item, the client must encrypt the item and all other referenced items the client deems related.

When the server returns an item to the client, it sends back an optional computed value for `presentation_url`. This URL is decided by the server. The server should also know how to respond to this URL.


# Next Steps

Check out the [client development guide](https://github.com/standardnotes/standardnotes.github.io/blob/master/doc/client-dev-guide.md) for a practical guide to developing an application on top of Standard File.

Join the [Slack group](https://slackin-ekhdyygaer.now.sh/) to discuss implementation details and ask any questions you may have.

You can also email [standardnotes@bitar.io](mailto:standardnotes@bitar.io).

Follow [@standardnotes](https://twitter.com/standardnotes) for updates and announcements.
