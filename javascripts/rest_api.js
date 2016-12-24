var apiData = {
  auth : [
    {
      verb : "POST",
      path : "auth",
      desc : "Registers a user and returns a JWT",
      params : [
        {
          name : "email",
          desc : ""
        },
        {
          name : "password",
          desc : ""
        },
        {
          name : "pw_func",
          desc : ""
        },
        {
          name : "pw_alg",
          desc : ""
        },
        {
          name : "pw_key_size",
          desc : ""
        },
        {
          name : "pw_cost",
          desc : ""
        },
        {
          name : "pw_nonce",
          desc : ""
        }
      ],
      responses : [
        {
          status : "200",
          body : "{\"jwt\" : \"...\"}"
        },
        {
          status : "5xx",
          body : "{\"errors\" : []}"
        }
      ]
    },

    {
      verb : "PATCH",
      path : "auth",
      desc : "Updates a user's password.",
      params : [
        {
          name : "email",
          desc : ""
        },
        {
          name : "password",
          desc : ""
        },
        {
          name : "password_confirmation",
          desc : ""
        },
        {
          name : "current_password",
          desc : ""
        }
      ],
      responses : [
        {
          status : "204",
          body : "No Content"
        },
        {
          status : "5xx",
          body : "{\"errors\" : []}"
        }
      ]
    },


    {
      verb : "POST",
      path : "auth/sign_in",
      desc : "Authenticates a user and returns a JWT.",
      params : [
        {
          name : "email",
          desc : ""
        },
        {
          name : "password",
          desc : ""
        }
      ],
      responses : [
        {
          status : "200",
          body : "{\"jwt\" : \"...\"}"
        },
        {
          status : "5xx",
          body : "{\"errors\" : []}"
        }
      ]
    },

    {
      verb : "GET",
      path : "auth/params",
      desc : "Returns the parameters used for password generation.",
      params : [
        {
          name : "email",
          desc : ""
        }
      ],
      responses : [
        {
          status : "200",
          body : "{\"pw_function\" : \"...\", \"pw_alg\" : \"...\", \"pw_cost\" : \"...\", \"pw_key_size\" : \"...\", \"pw_salt\" : \"...\"}"
        },
        {
          status : "5xx",
          body : "{\"errors\" : []}"
        }
      ]
    },
  ],

  users: [
    {
      verb : "GET",
      path : "users/me",
      desc : "Returns the current user as well as all the user's items.",
      params : [],
      responses : [
        {
          status : "200",
          body : "{\"email\" : \"...\", \"items\" : []}"
        },
        {
          status : "5xx",
          body : "{\"errors\" : []}"
        }
      ]
    },
  ],



  items : [
    {
      verb : "GET",
      path : "items",
      desc : "Gets all items for current user.",
      params : [
        {
          name: "updated_after",
          desc: "Optional. Return only items modified after a certain date."
        }
      ],
      responses : [
        {
          status : "200",
          body : "{\"items\" : []}"
        },
        {
          status : "5xx",
          body : "{\"errors\" : []}"
        }
      ]
    },
    {
      verb : "GET",
      path : "items/:id",
      desc : "Gets a particular item.",
      params : [],
      responses : [
        {
          status : "200",
          body : "{\"item\" : {}}"
        },
        {
          status : "5xx",
          body : "{\"errors\" : []}"
        }
      ]
    },
    {
      verb : "POST",
      path : "items",
      desc : "Creates or updates an item. This endpoint must be able to handle both a single item or an array of items. If the item doesn't exist, it should be created.",
      params : [
        {
          name : "item or items",
          desc : "A single item or an array of items"
        }
      ],
      responses : [
        {
          status : "200",
          body : "{\"items\" : {}}"
        },
        {
          status : "5xx",
          body : "{\"errors\" : []}"
        }
      ]
    },
    {
      verb : "DELETE",
      path : "items/:id",
      desc : "Deletes an item.",
      params : [],
      responses : [
        {
          status : "204",
          body : "No Content"
        },
        {
          status : "5xx",
          body : "{\"errors\" : []}"
        }
      ]
    }
  ]
}
