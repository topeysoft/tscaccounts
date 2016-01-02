var steps={
            welcome:  { text: "Welcome", active: true, 
                controls: [
                    {
                        type:"h1", 
                        class: "thin center-align",
                        html: "Welcome to TopeySoft User Management Installation Wizard"
                     },
                    {
                        type:"h1",
                        class:"thin center-align"
                    },
                    {
                        type: "h1",
                        class: "fa fa-magic center-align"
                    },
                    {
                        type: "p",
                        class: "flow-text",
                        html: " This wizard will walk you through a step-by-step installation and configuration of your new website or blog, well you'll decide here in a minute."
                    },
                    {
                        type: "p",
                        class: "center-align",
                    }, 
                    {
                        type: "a",
                        href: "#app_info",
                        class: "btn blue-grey waves-effect waves-light",
                        html: " Shall we begin <i class=\"fa fa-magic\">"
                    }
                ]
            },
            app_info: {
                text: "App Info Setup",
                controls: [
                  {
                    type: "h1",
                    class: "thin center-align",
                    html: "General Information"
                  },
                    {
                      type: "h1",
                      class: "fa fa-magic center-align"
                    },
                    {
                      type: "div",
                      class: "flow-text",
                      html: " <div class=\"col s12 m13\"><div class=\"input-label col s12 m3 right-align flow-text ng-binding\">App Title:</div><div class=\"col s10 push-s1 m5\"><input data-ng-model=\"config.app_info.title.value\" class=\"input-field padded-input widen-input ng-pristine ng-untouched ng-valid\"></div><span class=\"input-prompt col s10 push-s1 m4 ng-binding\"></span></div>"
                    },

                ]
            },
        // {text:"Themes and Layout Config", href:"#layout" },usermanagement:
        // {text:"User Management", href:"#usermanagement"},admin:
            admin: {
              text: "Grand Admin",
              controls: [
                    {
                      type: "h1",
                      class: "thin center-align",
                      html: "Default Admin Setup"
                    },
                      {
                        type: "h1",
                        class: "fa fa-magic center-align"
                      },
                      {
                        type: "div",
                        class: "flow-text",
                        html: " <div class=\"col s12 m13\"><div class=\"input-label col s12 m3 right-align flow-text ng-binding\">First Name:</div><div class=\"col s10 push-s1 m5\"><input data-ng-model=\"config.admin.first_name\" class=\"input-field padded-input widen-input ng-pristine ng-untouched ng-valid\"></div><span class=\"input-prompt col s10 push-s1 m4 ng-binding\"></span></div>"
                      },
                      {
                        type: "div",
                        class: "flow-text",
                        html: " <div class=\"col s12 m13\"><div class=\"input-label col s12 m3 right-align flow-text ng-binding\">Last Name:</div><div class=\"col s10 push-s1 m5\"><input data-ng-model=\"config.admin.last_name\" class=\"input-field padded-input widen-input ng-pristine ng-untouched ng-valid\"></div><span class=\"input-prompt col s10 push-s1 m4 ng-binding\"></span></div>"
                      },
                      {
                        type: "div",
                        class: "flow-text",
                        html: " <div class=\"col s12 m13\"><div class=\"input-label col s12 m3 right-align flow-text ng-binding\">Email:</div><div class=\"col s10 push-s1 m5\"><input data-ng-model=\"config.admin.email\" class=\"input-field padded-input widen-input ng-pristine ng-untouched ng-valid\"></div><span class=\"input-prompt col s10 push-s1 m4 ng-binding\"></span></div>"
                      },
                      {
                        type: "div",
                        class: "flow-text",
                        html: " <div class=\"col s12 m13\"><div class=\"input-label col s12 m3 right-align flow-text ng-binding\">Password:</div><div class=\"col s10 push-s1 m5\"><input data-ng-model=\"config.admin.password\" class=\"input-field padded-input widen-input ng-pristine ng-untouched ng-valid\"></div><span class=\"input-prompt col s10 push-s1 m4 ng-binding\"></span></div>"
                      },

              ]
            },
        //  {text:"Permissions Setup", href:"#permissions"},roles:
        //{text:"Roles Setup", href:"#roles" },
        installing:{text:"Performing Installation", enabled:false },
        finished:{text:"Finished", enabled:false }
    }