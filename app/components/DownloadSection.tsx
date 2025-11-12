"use client"

import { motion } from 'framer-motion';
import { FileText, Download, Sparkles } from 'lucide-react';

export default function DownloadSection() {
  return (
    <section className="relative py-20 bg-gradient-to-b from-white via-blue-50/30 to-white overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto px-4 relative z-10">
        {/* Header with badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          {/* Badge */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, type: "spring" }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full text-xs font-medium mb-4 shadow-lg"
          >
            <Sparkles className="w-4 h-4" />
            <span>เอกสารสำคัญ</span>
          </motion.div>

          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4">
            โครงการ SDN FUTSAL NO-L 2026
          </h2>
          <p className="text-lg md:text-xl text-gray-700 font-medium">
            รุ่นอายุไม่เกิน 15 ปีชาย ไม่เกิดก่อน พ.ศ. 2554
          </p>
          <p className="text-sm text-gray-600 mt-3">
            ดาวน์โหลดใบสมัครและศึกษาคู่มือการแข่งขันได้ที่
          </p>
        </motion.div>

        {/* Download Buttons with enhanced design */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* คู่มือการแข่งขัน */}
          <motion.a
            href="https://drive.google.com/file/d/14U7FqNtv9laByNj-vX9BZm6e9p7b0Uoj/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            whileHover={{ scale: 1.03, y: -5 }}
            whileTap={{ scale: 0.98 }}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 p-[2px] shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            {/* Animated gradient border */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />

            <div className="relative bg-white rounded-2xl p-6 h-full flex items-center gap-4">
              {/* Icon with glow */}
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/30 rounded-xl blur-lg group-hover:blur-xl transition-all" />
                <div className="relative flex-shrink-0 w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <FileText className="w-7 h-7 text-white" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-gray-900 mb-1 flex items-center gap-2">
                  คู่มือการแข่งขัน
                  <motion.div
                  >
                  </motion.div>
                </h3>
                <p className="text-sm text-gray-600">
                  กฎกติกาและรายละเอียดการแข่งขัน
                </p>
              </div>

              {/* Download icon with animation */}
              <motion.div
              >
                <Download className="w-6 h-6 text-blue-500 group-hover:text-blue-600" />
              </motion.div>
            </div>
          </motion.a>

          {/* ใบสมัครเข้าร่วมการแข่งขัน */}
          <motion.a
            href="https://docs.google.com/document/d/1wc35n4wu-9qwnk6sDXrW2VJjpNftoAYc/edit"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.03, y: -5 }}
            whileTap={{ scale: 0.98 }}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 p-[2px] shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            {/* Animated gradient border */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-orange-400 via-amber-400 to-orange-400"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
            />

            <div className="relative bg-white rounded-2xl p-6 h-full flex items-center gap-4">
              {/* Icon with glow */}
              <div className="relative">
                <div className="absolute inset-0 bg-orange-500/30 rounded-xl blur-lg group-hover:blur-xl transition-all" />
                <div className="relative flex-shrink-0 w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <FileText className="w-7 h-7 text-white" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-gray-900 mb-1 flex items-center gap-2">
                  ใบสมัครเข้าร่วมการแข่งขัน
                  <motion.div>
                  </motion.div>
                </h3>
                <p className="text-sm text-gray-600">
                  SDN FUTSAL NO-L CUP 2026 ครั้งที่ 8
                </p>
              </div>

              {/* Download icon with animation */}
              <motion.div
                className="flex-shrink-0"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
              >
                <Download className="w-6 h-6 text-orange-500 group-hover:text-orange-600" />
              </motion.div>
            </div>
          </motion.a>
        </div>

        {/* Info Note with better styling */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center "
        >
          <p className="text-sm text-gray-700 font-medium">
            <span className="inline-block mr-2">📋</span>
            กรุณาศึกษาคู่มือการแข่งขันอย่างละเอียดก่อนส่งใบสมัคร
          </p>
        </motion.div>
      </div>
    </section>
  );
}
