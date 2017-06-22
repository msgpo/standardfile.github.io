<h1><a id='intro'></a> Intro </h1>

Many of us today are digital nomads: we go from app to app, service to service, looking for the best solution. And since most "solutions" are proprietary, we often have to say goodbye to our old data, or manually and painstakingly transfer it over.

Standard File is one account for every human. This account can store almost any data type, and supports strong encryption and privacy by default.

Why would you want a Standard File account?

1. **Convenience**. You don't have to manage hundreds of different accounts, and worry about backups if one of those services go offline. Your one Standard File account manages all your data across all applications that support the Standard File format.
1. **Data lifetime**. The Standard File format is a growth-resistant format. Because it is a generalized and abstracted system, it can handle almost any application type without needing to change. This means your data is always easy to parse by applications. And, because the data format is simple, this makes it easy for developers to create new applications that parse your data and offer new utilities on top of this data.
2. **More choices**. Today, when a company offers a service that's useful, it's hard to move to something else, even if you really want to. The Standard File system allows app developers to focus on creating great applications, without having to worry about managing servers. This means a richer ecosystem of great applications that don't lock you in.
3. **Security**. All apps that use the Standard File system are required to encrypt data locally before sending that data to the server. This means that servers do not have to be trusted. In fact, even if your data was stolen from a hacked server, that data would be unreadable and useless to an attacker.
4. **Privacy**. You can choose any Standard File hosting provider, or run a Standard File server of your own. Because the choice is yours, you can always go with the provider that offers the highest level of privacy. And if ultimately that isn't enough for you, you can easily run your own Standard File system for 100% privacy control.


<h2><a id='getting-started'></a>Getting Started</h2>

To get started with a Standard File account, find [apps](https://standardnotes.org) that support the Standard File format.

These apps will ask you for a Standard File server location. You can use any of these free servers:

https://n3.standardnotes.org

Simply register for a Standard File account using one of the available apps.

*Note: because your data is encrypted before being sent to the server, it is not necessarily important to "trust" these servers. This means you can choose any server and rest assured that your data is secure.*

If you're tech savvy, you can even [host your own Standard File server](https://github.com/standardfile/ruby-server/wiki/Deploying-a-private-Standard-File-server-with-Amazon-EC2-and-Nginx).

<h2><a id='developers'></a>Developers</h2>

To build a quality application, most app developers today have to implement not only their own front-end clients, but also a backend architecture to handle model storage for their specific schema. With the growing trend of 'experimental' and 'single-use' applications, which frequently make their rounds on sites like Product Hunt, it becomes impractical to build a new server infrastructure for every application.

Standard File makes use of progressions in consumer device performance and capacity. Handheld client devices such as smartphones today are more powerful than server architectures decades ago. And while it may have made sense back then to let the server handle all model and business logic for an application, today clients are plenty powerful to do this on their own.

This is the paradigm that Standard File relies on, which allows for "server" related code to be handled by the client device instead. Because data logic is handled by the client device, this means end-to-end encryption can also come standard. The server is treated as a dummy model store, without knowledge of the contents.

One can build any client application with the same Standard File server.

The future vision of Standard File is for every person to have their own Standard File server, whether shared or private, that allows them to use one account for all their data, across multiple clients that offer different utilities. For example, one client could be a notes app. Another could be a desktop file sync. And yet another could be a photos manager. All these apps could be built off the same Standard File server. This makes it so that developers don't have to worry about building a secure back end system, and so that end users don't have to worry about data security and ownership.

Today, [a robust notes system](https://standardnotes.org) has already been built on top of Standard File.

# Protocol Specification

**Version 0.0.2**

_(For the 0.0.1 specification, see [here](https://github.com/standardfile/standardfile.github.io/blob/master/doc/spec-001.md))_

While most protocol specifications are hard to read and unnecessarily complex, Standard File aims to be a simple system that any developer can understand and implement.

<h2><a id='implementations'></a>Implementations</h2>

[Ruby Implementation](https://github.com/standardnotes/ruby-server)

[Go Implementation](https://github.com/tectiv3/standardfile)


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
| email | String | The email of the user. |
| password | String | The password for this user. _Note that passwords must be manipulated before being sent to the server._ |
| pw_cost | String | The number of iterations to use for the KDF. See Encryption for more. |
| pw_salt | String | Generated by the client during registration. See Encryption for more. |
| pw_auth | String | An authentication hash of the auth parameters (pw_cost, pw_salt).

<h1><a id='items'></a>Items</h1>

Item models have the following properties:

| name | type | description |
| --- | --- | --- |
| content | Text (Base64) | The JSON string encoded structure of the note, encrypted. |
| content_type | String | The type of the structure contained in the `content` field. |
| enc_item_key | String (Base64) | The locally encrypted encryption key for this item. |
| deleted | Bool | Whether the model has been deleted. |
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

*Params: email, password, pw_cost, pw_salt, pw_auth*

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
{"token" : "..."}
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
{"pw_cost" : "...", "pw_salt" : "...", "pw_auth" : "..."}
```

5xx

```
{"errors" : []}
```

<h1><a id='api-items'></a>Items</h1>


#### POST items/sync
**Saves local changes as well as retrieves remote changes.**

*Params:*

- `items`: An array of items
- `sync_token`: the sync token returned from the previous sync call. Leave empty if first sync.
- `limit`: (optional) the number of results to return. `cursor_token` is returned if more results are available.

Responses

200

```
{"retrieved_items" : [], "saved_items" : [], "unsaved_items" : [], "sync_token" : ""}
```

5xx

```
{"errors" : []}
```

### Sync Discussion

**Deletion:**

- Clients: set `deleted` equal to `true` and sync. When receiving an item that is `deleted`, remove it from the local database immediately.
- Servers: if syncing an item that is `deleted`, clear out its `content` and `enc_item_key` fields, set `deleted` to true, and save.

**Sync completion:**

Upon sync completion, the client should handle each response item as follows:

- `retrieved_items`: these items are new or have been modified since last sync and should be merged or created locally.
- `saved_items`: saved items are dirty items that were sent to the sync request. These items should not be merged in their entirety upon completion. Instead, only their metadata should be merged. For example, if at Point A the client syncs a Note item that a user is still typing, and at Point B the sync completes, the user could have typed more content in between A and B. Thus, if you merge all content, the user's progress in between A and B will be lost. However, if you merge just the metadata, then this issue does not occur.
- `unsaved_items`: returned if an error occurred saving those items. The only reason this should happen is in the improbable case of a UUID conflict.
- `sync_token`: this token should be saved when it is received and sent to subsequent sync requests. This token should also be persisted locally between app sessions. For first time sync, no token should be provided.
- `cursor_token`: returned if original request had a `limit`. Send this token back to the server to retrieve next page of results.

<h1><a id='import-export'></a>Import/Export</h1>

The export file is a JSON file of all the user's items, unencrypted.

**Format:**

```
{
  "items": [
    {
      "uuid": "3162fe3a-1b5b-4cf5-b88a-afcb9996b23a",
      "content_type": "Note",
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
4.  Client B iterates over items and encrypts the content of each of them locally.
5.  Client B sends items (with encrypted item content) data to server B as normal POST request to `/items`.

<h1><a id='encryption'></a>Encryption</h1>

Encryption and security should always be top of mind with Standard File.

It is important that there exist a separation of concerns between the server and the client. That is, the client should not trust the server, and vice versa.

Encryption keys are generated by stretching the user's input password using a [key derivation function.](https://en.wikipedia.org/wiki/Key_derivation_function)

The resulting key is split in three — the first third is sent to the server as the user's password, the second third is saved locally as the user's master encryption key, and the last third is used as an authentication key. This way, the server can never compute the encryption key.

Note: client-server connections must be made securely through SSL/TLS.

#### Elaboration on User model encryption related fields

| name | details |
| --- | --- |
| pw_cost | The number of iterations to be used by the KDF. On native platforms, this should be around 60,000\. However note that non-native clients (web clients not using WebCrypto) will not be able to handle any more than 5,000 iterations. |
| pw_salt | A salt for password derivation. This value is initially created by the client during registration |
| pw_auth | The HMAC-256 of `pw_cost` and `pw_salt` joined by a `:` character |

<h1><a id='key-generation'></a>Key Generation</h1>

### Client Instructions

Given a user inputted password `uip`, the client's job is to generate a password `pw` to send to the server, a master key `mk` that the user stores locally to encrypt/decrypt data, and an auth key `ak` for authenticating server params.

**Login Steps**

1.  Client makes GET request with user's email to `auth/params` to retrieve password salt, cost, and auth.
2.  Client computes `pw`, `mk`, and `ak`:

    ```
    key = pbkdf2(uip, pw_salt, sha512, 768, pw_cost)
    pw = key.substring(0, key.length/3)
    mk = key.substring(key.length/3, key.length/3)
    ak = key.substring(key.length/3 * 2, key.length/3)
    ```
3. Client computes `local_pw_auth` to make sure it matches with server `pw_auth`. If not, the server parameters are invalid and the client should abort authentication.

    ```
    local_pw_auth = HMAC-SHA256([pw_cost, pw_salt].join(":"), ak)
    if(local_pw_auth != pw_auth) {
      return;
    }
    ```

3.  Client sends `pw` to the server as the user's "regular" password and stores `mk` and `ak` locally. (`mk` and `ak` are never sent to the server).

**Registration Steps**

1.  Client chooses default for `pw_cost` (minimum 3000).
2.  Client generates `pw_salt`:

    ```
    nonce = random_string(128) // 128 bit random key
    pw_salt = SHA1:Hexdigest([email, nonce].join(":"))
    ```

3.  Client computes `pw`, `mk`, and `ak` using step (2) from Authentication Steps.

4. Client generates `pw_auth`:

    ```
    pw_auth = HMAC-SHA256([pw_cost, pw_salt].join(":"), ak)
    ```

5. Client registers with `email`, `pw`, `pw_cost`, `pw_salt`, and `pw_auth`.

<h1><a id='item-encryption'></a>Encryption and Auth Keys</h1>

In general, when encrypting a string, one should use an IV so that two subsequent encryptions of the same content yield different results, and one should authenticate the data as to ascertain its authenticity and lack of tampering.

In Standard File, two strings are encrypted for every item:
- The item's `content`.
- The item's `enc_item_key`.

For every string, we need to generate and store a unique IV, as well as the resulting auth hash. To generate an auth hash, we'll use the auth key `ak` generated during the previous steps.

<h1><a id='item-encryption'></a>Item Encryption</h1>

## Client-side

An item is encrypted using a random key generated for each item.

**Encryption:**

*Encryption version: 002.* (You'll use this version string as indicated below.)

Note that when encrypting/decrypting data, keys should be converted to the proper format your platform function supports. It's best to convert keys to binary data before running through any encryption/hashing algorithm.

For every item:

1.  Generate a random 512 bit key `item_key` (in hex format).
2.  Split `item_key` in half; set item encryption key `item_ek = first_half` and item authentication key `item_ak = second_half`.
3.  Encrypt `content` using `item_ek` and `item_ak` following the instructions "Encrypting a string using the 002 scheme" below and send to server as `content`.
4.  Encrypt `item_key` using the global `mk` and global `ak` following the instructions "Encrypting a string using the 002 scheme" below and send to server as `enc_item_key`.


### Encrypting a string using the 002 scheme:

Given a `string_to_encrypt`, an `encryption_key`, and an `auth_key`:

1.  Generate a random 128 bit string called IV.
1.  Encrypt `string_to_encrypt` using `AES-CBC-256:Base64`, `encryption_key`, and `IV`:

  ```
  ciphertext = AES-Encrypt(string_to_encrypt, encryption_key, IV)
  ```

1.  Generate `string_to_auth` by combining the encryption version (002), the IV, the item's UUID, and the ciphertext using the colon ":" character:

  ```
  string_to_auth = ["002", IV, uuid, ciphertext].join(":")
  ```

1.  Compute `auth_hash = HMAC-SHA256:Hex(string_to_auth, auth_key)`.
1.  Generate the final result by combining the five components into a `:` separated string:
  ```
  result = ["002", auth_hash, IV, uuid, ciphertext].join(":")
  ```


**Decryption:**

Check the first 3 characters of the `content` string. This will be the encryption version.

- If it is equal to "001", which is a legacy scheme, decrypt according to the 001 instructions found [here](https://github.com/standardfile/standardfile.github.io/blob/master/doc/spec-001.md).

- If it is equal to "002", which is the current scheme, decrypt as follows:

  1.  Decrypt `enc_item_key` using the global `mk` and global `ak` according to the "Decrypting a string using the 002 scheme" instructions below to get `item_key`.
  2.  Split `item_key` in half; set encryption key `item_ek = first_half` and authentication key `item_ak = second_half`.
  3.  Decrypt `content` using `item_ek` and `item_ak` according to the "Decrypting a string using the 002 scheme" instructions below.


### Decrypting a string using the 002 scheme:

Given a `string_to_decrypt`, an `encryption_key`, and an `auth_key`:

1. Split the string into its constituent parts: `components = string_to_decrypt.split(":")`.
1. Assign local variables:

  ```
  version = components[0]
  auth_hash = components[1]
  IV = components[2]
  uuid = components[3]
  ciphertext = components[4]
  ```

1. Ensure that `uuid === item.uuid`. If not, abort decryption.
1. Generate `string_to_auth = [version, IV, uuid, ciphertext].join(":")`.
1. Compute `local_auth_hash = HMAC-SHA256(string_to_auth, auth_key)`. Compare `local_auth_hash` to `auth_hash`. If they are not the same, skip decrypting this item, as this indicates that the string has been tampered with.
1. Decrypt `ciphertext` to get final result: `result = AES-Decrypt(ciphertext, encryption_key, IV)`.

## Server-side

For every received item:

1.  (Optional but recommended) Encrypt `content` using server known key and store. Decrypt before sending back to client.

# Next Steps

Check out the [client development guide](https://github.com/standardnotes/doc/blob/master/Client%20Development%20Guide.md) for a practical guide to developing an application on top of Standard File.

If you're a developer, see [Developer Resources](https://standardnotes.org/developers).

Join the [Slack group](https://standardnotes.org/slack) to discuss implementation details and ask any questions you may have.

You can also email [hello@standardnotes.org](mailto:hello@standardnotes.org).

Follow [@standardnotes](https://twitter.com/standardnotes) for updates and announcements.
