<template>
    <v-container>

        <v-row>
            <v-col cols="12" md="12">

                <v-card color="#7d0c14">
                    
                    <v-card-title class="text-center">
                        <center><v-img src="/img/logo2.png" width="20%"></v-img></center>
                        <h1>สมัครสมาชิก</h1>
                    </v-card-title>
                    <v-card-text class="bg-white">
                        <v-form @submit.prevent="saveMember">
                            <v-row>
                                <v-col cols="12" md="6">
                                    <v-text-field label="กรอกชื่อ" v-model="form.first_name" :error-messages="error.first_name"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field label="กรอกนามกสุล" v-model="form.last_name" :error-messages="error.last_name"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field label="กรอกอีเมล" v-model="form.email" :error-messages="error.email"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field label="กรอกชื่อผู้ใช้" v-model="form.username" :error-messages="error.username"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field label="กรอกรหัสผ่าน" v-model="form.password" :error-messages="error.password" :type="showPw ? 'text':'password'" :prepend-inner-icon="show ? 'mdi-eye':'mdi-eye-off'" @click:prepend-inner="show = !show, showPw = !showPw"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field label="ยืนยันรหัสผ่าน" v-model="confirm" :error-messages="error.confirm" :type="showPw2 ? 'text':'password'" :prepend-inner-icon="show2 ? 'mdi-eye':'mdi-eye-off'" @click:prepend-inner="show2 = !show2, showPw2 = !showPw2"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="12">
                                    <v-select :items="typeG" prepend-inner-icon="mdi-account-group" label="ประเภทสมาชิก" v-model="form.role" :error-messages="error.role"></v-select>
                                </v-col>
                                <v-col cols="12" md="12">
                                    <v-file-input label="รูปภาพสมาชิก" v-model="pic_user" :error-messages="error.pic_user"></v-file-input>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12" md="12">
                                    <center>
                                        <v-btn type="submit" class="text-center text-white" color="primary">สมัครสมาชิก</v-btn>
                                        &nbsp;
                                        <v-btn type="reset" class="text-center text-white" color="red">ยกเลิก</v-btn>
                                    </center>
                                </v-col>
                            </v-row>
                        </v-form>
                        <nuxt-link to="/" class="text-center text-blue"><p>หากมีบัญชี? เข้าสู่ระบบ</p></nuxt-link>
                    </v-card-text>
                </v-card>

            </v-col>
        </v-row>

    </v-container>
</template>

<script setup lang="ts">

import axios from 'axios';
import {api} from '../API/base'

const form = ref({

    first_name:'',
    last_name:'',
    email:'',
    username:'',
    password:'',
    role:''

})

const pic_user = ref<File | null>(null)
const error = ref<Record<string,string>>({})
const show = ref(false)
const show2 = ref(false)
const showPw = ref(false)
const showPw2 = ref(false)

const emailRegex = /^[^\s]+@[^\s]+\.[^\s]{2,}$/i
const confirm = ref('')

const typeG = ['ฝ่ายบุคลากร','ผู้รับการประเมินผล','กรรมการประเมิน']

function validateFrom(){

    error.value = {}
    const f = form.value

    if(!f.first_name.trim())error.value.first_name = 'กรุณากรอกชื่อ'
    if(!f.last_name.trim())error.value.last_name = 'กรถณากรอกนามสกุล'
    if(!f.email.trim())error.value.email = 'กรุณากรอกอีเมล'
    else if(!emailRegex.test(f.email.trim()))error.value.email = 'รูปแบบอีเมลไม่ถูกต้อง'

    if(!f.password.trim())error.value.password = 'กรุณากรอกรหัสผ่าน'
    else if(f.password.trim().length < 6)error.value.password = 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัว '
    else if(f.password.trim() != confirm.value.trim())error.value.confirm = 'รหัสผ่านไม่ตรงกัน'

    if(!f.username.trim())error.value.username = 'กรุณากรอกชื่อผู้ใช้'
    else if(f.username.trim().length < 4)error.value.username = 'ชื่อผู้ใช้ต้องมีความยาวอย่างน้อย 4 ตัว'

    if(!f.role.trim())error.value.role = 'กรุณาเลือกประเภทสมาชิก'

    return Object.keys(error.value).length === 0

}

const saveMember = async()=>{

    if(!validateFrom())return
    const formData = new FormData
    formData.append('form',JSON.stringify(form.value))
    formData.append('pic_user',pic_user.value!)

    try {
        
        await axios.post(`${api}/auth/regis`,formData)
        alert("สมัครสมาชิกสำเร็จ")
        navigateTo('/',{replace:true})

    } catch (error) {
        
        console.error("REGIS FAIL")

    }

}



</script>

<style scoped>

</style>