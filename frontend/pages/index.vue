<template>
    <v-container fluid>
        <v-row justify="center" class="text-center">
            <v-col cols="12" md="6" lg="6">
                <center>
                    <v-card color="#7d0c14">
                        <v-img src="/img/logo.png" class="mt-4" width="30%"></v-img>
                        <v-card-title>
                            <h2 class="text-center text-h5">NTC EVALUATION SYSTEM</h2>
                            <p class="text-center">ระบบประเมินบุคลากรวิทยาลัยเทคนิคน่าน</p>
                        </v-card-title><br>
                        <v-card-text class="bg-white">
                            <v-alert v-if="error" color="error" variant="tonal" class="text-start">{{ error }}</v-alert>
                            <v-form @submit.prevent="login">
                                <v-row>
                                    <v-col cols="12" md="12">
                                        <v-text-field label="ชื่อผู้ใช้" v-model="username"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="12">
                                        <v-text-field label="รหัสผ่าน" v-model="password" :prepend-inner-icon="show ? 'mdi-eye-off':'mdi-eye'" :type="showPw ? 'text':'password'" @click:prepend-inner="show = !show , showPw = !showPw"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="12">
                                        <v-select label="เลือกประเภทสมาชิก" :items="typeR" v-model="role"></v-select>
                                    </v-col>
                                    <v-col cols="12" md="12">
                                        <v-btn type="submit" block variant="flat" class="text-center" color="#7d0c14">เข้าสู่ระบบ</v-btn>
                                    </v-col>
                                </v-row>
                            </v-form>
                            <nuxt-link to="/"><p class="text-decoration-none text-blue">หากไม่มีบัญชี? <v-chip color="primary" prepend-icon="mdi-account">สมัครสมาชิก</v-chip></p></nuxt-link>
                        </v-card-text>

                    </v-card>
                </center>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">

import axios from 'axios';
import auth from '../API/auth'

definePageMeta({
    layout:false
})

const show = ref(false)
const showPw = ref(false)
const error = ref('')
const typeR = ["ฝ่ายบุคลากร","ผู้รับการประเมินผล","กรรมการประเมิน"]
const username = ref('')
const password = ref('')
const role = ref('')

const login = async()=>{

    try {
        
        const res = await auth.login(
            {
                username:username.value,
                password:password.value,
                role:role.value
            }
        )
        console.log("login success",res.data)
        localStorage.setItem('token',res.data.token)
        const useRole = res.data.role
        
        if(useRole === 'ฝ่ายบุคลากร')return useRouter().push('/Staff')
        else if(useRole === 'ผู้รับการประเมินผล')return useRouter().push('/Evaluatee')
        else if(useRole === 'กรรมการประเมิน')return useRouter().push('/Committee')

    } catch (err:any) {

        console.error("Error Login",err)
        error.value = error.response?.data?.message || 'เข้าสู่ระบบไม่สำเร็จ'
        
    }
}

</script>

<style scoped>

</style>