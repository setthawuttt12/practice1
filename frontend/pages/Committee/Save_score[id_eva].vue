<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-alert type="info" v-if="user.status_eva === 1">ผู้รับการประเมินยังไมไ่ด้ประเมินตนเอง</v-alert>
                <v-form v-else-if="user.status_commit === 'n'" @submit.prevent="saveScore">
                    <h1 class="text-h5 font-weight-bold">แบบประเมิน</h1>
                    <v-card class="pa-2 mt-2">
                        <p>ชื่อ - นามสกุล : {{ user.first_name }} {{ user.last_name }}</p>
                        <p>รอบประเมินที่ : {{ user.round_sys }} ปี {{ user.year_sys }}</p>
                    </v-card>
                    <v-row class="mt-2" v-for="(topic, t) in topics" :key="topic.id_topic">
                        <v-col cols="12">
                            <h1 class="text-h6">{{ t + 1 }}.{{ topic.name_indicate }}</h1>
                            <v-card class="pa-2">
                                <v-row v-for="(indicate, i) in topic.indicates" :key="indicate.id_indicate">
                                    <v-col cols="12">
                                        {{ t + 1 }}.{{ i + 1 }} {{ indicate.name_indicate }} รายละเอียดตัวชี้วัด : {{
                                        indicate.detail_indicate }} น้ำหนักคะแนน : {{ indicate.point_indicate }}
                                        คะแนนเต็ม : {{ indicate.point_indicate * 4 }}
                                        <p class="mt-2">รายละเอียด : {{ indicate.detail_eva || '-' }}</p>
                                        <p class="mt-2">file : <v-btn v-if="indicate.file_eva" size="small"
                                                @click="viwes(indicate.file_eva)" color="blue">เปิดดู</v-btn><span
                                                v-else></span></p>
                                        <!-- <v-textarea label="คำอธิบายเพิ่มเติม(ถ้ามี)" v-model="indicate.detail_eva" rows="2"></v-textarea> -->
                                        <!-- <v-file-input label="file *** รองรับเฉพาะนามสกุลไฟล์ .png .jpg .pdf *** " @change="onFileChange($event,topic.id_topic,indicate.id_indicate)" appect=".png .jpg .pdf"></v-file-input> -->
                                        <v-select class="mt-2" label="ใส่คะแนนประเมิน 1-4" :items="[1, 2, 3, 4]"
                                            v-model="indicate.score"></v-select>
                                        <!-- <v-text-field v-else label="ใส่คะแนนประเมิน 1-4" @input="indicate.score > 4? indicate.score = 4 : null" type="number" v-model="indicate.score"></v-text-field> -->
                                    </v-col>
                                </v-row>
                            </v-card>
                        </v-col>
                    </v-row>
                    <div class=" mt-4">
                        <v-card class="pa-2">
                            <label for="">ข้อเสนอแนะ</label>
                            <v-textarea label="(ถ้ามี)" v-model="detail_commit" rows="2"></v-textarea>
                        </v-card>
                    </div>
                    <div class="text-center mt-4">
                        <v-btn type="submit" color="blue">บันทึกคะแนน</v-btn>
                    </div>
                </v-form>
                <v-alert type="success"
                    v-else-if="user.status_eva === 2 || user.status_eva === 3">ประเมินสำเร็จ</v-alert>
                <v-alert type="warning" v-else>ยังไม่มีแบบประเมิน</v-alert>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios';
import { commit } from '../../API/base'

const user = ref<any>({})
const topics = ref<any>([])
const detail_commit = ref('')
const id_eva = useRoute().params.id_eva

const fetchUser = async () => {
    const token = localStorage.getItem('token')
    try {
        const res = await axios.get(`${commit}/save_score/user/${id_eva}`, { headers: { Authorization: `Bearer ${token}` } })
        user.value = res.data
    } catch (error) {
        console.error('Error Get User', error)
    }
}

const fetchTopics = async () => {
    const token = localStorage.getItem('token')
    try {
        const res = await axios.get(`${commit}/save_score/topic/${id_eva}`, { headers: { Authorization: `Bearer ${token}` } })
        topics.value = res.data
    } catch (error) {
        console.error('Error Get User', error)
    }
}
onMounted(async () => {
    await Promise.all([fetchUser(), fetchTopics()])
})

const viwes = (filename: string) => {
    const url = `http://localhost:3001/uploads/evadetail/${filename}`
    window.open(url, '_blank')
}
const saveScore = async () => {
    const token = localStorage.getItem('token')
    const formData = new FormData()
    const allScore = topics.value.flatMap((t: any) =>
        t.indicates.map((i: any) => {
            return {
                id_topic: t.id_topic,
                id_indicate: i.id_indicate,
                score: i.score,
            }
        })
    )
    if (allScore.some((s: any) => !s.score)) {
        alert('กรุณากรอกคะแนนให้สมบุรณ์')
        return
    }
    formData.append('scores', JSON.stringify(allScore))
    const detail_commitTo = ref('')
    if (detail_commit.value && detail_commit.value.trim()) {
        detail_commitTo.value = detail_commit.value
    } else {
        detail_commitTo.value = 'ไม่มี'
    }
    try {
        await axios.post(`${commit}/save_score/save/${id_eva}`, formData, { headers: { Authorization: `Bearer ${token}` } })
        alert('ประเมินสำเร็จ')
        await Promise.all([fetchUser(), fetchTopics()])
        // navigateTo('/Committee/Check_confirm', { replace: true })
    } catch (error) {
        console.error('Error Post Score', error)
    }
}
</script>

<style scoped></style>