<template>
  <v-main class="profile-page">
    <section class="page-content pb-15 mx-xs-0 mx-sm-5 mx-md-auto">
      <v-card flat class="pa-5">
        <v-card-title>
          <span class="text-h5">My profile</span>
        </v-card-title>
        <v-card-text class="mt-10">
          <v-row class="ma-0 mb-15">
            <v-col cols="12" md="8" class="pa-0">
              <v-row class="ma-0">
                <v-col cols="12" md="6" class="pa-0 pr-10">
                  <v-text-field solo flat hide-details
                    background-color="#F8F9F9"
                    color="#0000001f"
                    v-model="username"
                    placeholder="User name..."
                  />
                </v-col>
                <v-col cols="12" md="6" class="pa-0 pr-10">
                  <v-text-field solo flat hide-details
                    background-color="#F8F9F9"
                    color="#0000001f"
                    v-model="email"
                    placeholder="Email..."
                  />
                </v-col>
              </v-row>
              <v-row class="ma-0 mt-5">
                <v-col cols="12" md="6" class="pa-0 pr-10">
                  <v-text-field solo flat hide-details
                    background-color="#F8F9F9"
                    color="#0000001f"
                    v-model="firstname"
                    placeholder="First name..."
                  />
                </v-col>
                <v-col cols="12" md="6" class="pa-0 pr-10">
                  <v-text-field solo flat hide-details
                    background-color="#F8F9F9"
                    color="#0000001f"
                    v-model="lastname"
                    placeholder="Last name..."
                  />
                </v-col>
              </v-row>
              <v-row class="ma-0 mt-5">
                <v-col cols="12" md="6" class="pa-0 pr-10">
                  <v-text-field solo flat hide-details
                    background-color="#F8F9F9"
                    color="#0000001f"
                    v-model="phone"
                    placeholder="Phone number..."
                    class="append-item"
                  >
                    <template slot="append">
                      <v-flex d-flex child-flex class="fill-height">
                        <v-btn tile text plain small
                          :ripple="false"
                          color="primary"
                          class="input-item py-4"
                        >
                          Verified
                        </v-btn>
                      </v-flex>
                    </template>
                  </v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="pa-0 pr-10">
                  <v-text-field solo flat hide-details
                    background-color="#F8F9F9"
                    color="#0000001f"
                    v-model="dob"
                    placeholder="Date of birth..."
                  />
                </v-col>
              </v-row>
              <v-row class="ma-0 mt-5">
                <v-col cols="12" md="6" class="pa-0 pr-10">
                  <v-text-field solo flat hide-details
                    background-color="#F8F9F9"
                    color="#0000001f"
                    v-model="address1"
                    placeholder="Address 1..."
                  />
                </v-col>
                <v-col cols="12" md="6" class="pa-0 pr-10">
                  <v-text-field solo flat hide-details
                    background-color="#F8F9F9"
                    color="#0000001f"
                    v-model="address2"
                    placeholder="Address 2..."
                  />
                </v-col>
              </v-row>
              <v-row class="ma-0 mt-5">
                <v-col cols="12" md="6" class="pa-0 pr-10">
                  <v-text-field solo flat hide-details
                    background-color="#F8F9F9"
                    color="#0000001f"
                    v-model="province"
                    placeholder="State/Province..."
                  />
                </v-col>
                <v-col cols="12" md="6" class="pa-0 pr-10">
                  <v-text-field solo flat hide-details
                    background-color="#F8F9F9"
                    color="#0000001f"
                    v-model="country"
                    placeholder="Country..."
                  />
                </v-col>
              </v-row>
              <v-row class="ma-0 mt-5">
                <v-col cols="12" md="6" class="pa-0 pr-10">
                  <v-text-field solo flat hide-details
                    background-color="#F8F9F9"
                    color="#0000001f"
                    v-model="city"
                    placeholder="City..."
                  />
                </v-col>
              </v-row>
              <v-row class="ma-0 mt-15">
                <v-col cols="12" md="6" class="pa-0 pr-10">
                  <v-btn block depressed outlined class="cancel-button">Cancel</v-btn>
                </v-col>
                <v-col cols="12" md="6" class="pa-0 pr-10">
                  <v-btn color="primary" block depressed>Save & Change</v-btn>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" md="4" class="pa-0 d-flex justify-center">
              <img src="/assets/images/profile-image.svg" alt=""/>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </section>
  </v-main>
</template>
<script>
export default {
  data () {
    return {
      username: '',
      email: '',
      firstname: '',
      lastname: '',
      phone: '',
      dob: null,
      address1: '',
      address2: '',
      province: null,
      country: null,
      city: null
    }
  }
}
</script>
