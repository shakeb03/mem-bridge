'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail } from 'lucide-react';
import { memColors } from '@/utils/colors';

export default function Footer() {
  const links = [
    {
      icon: Linkedin,
      href: 'https://linkedin.com/in/shakeb',
      label: 'LinkedIn',
    },
    {
      icon: Github,
      href: 'https://github.com/shakeb03',
      label: 'GitHub',
    },
    {
      icon: Mail,
      href: 'mailto:shakeb0092@gmail.com',
      label: 'Email',
    },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="border-t px-8 py-4"
      style={{
        backgroundColor: 'white',
        borderColor: memColors.gray200,
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Built by */}
        <div className="flex items-center gap-2">
          <span className="text-sm" style={{ color: memColors.gray600 }}>
            Built by
          </span>
          
            <a href="https://shakeb.tech"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-sm hover:underline transition-all"
            style={{ color: memColors.accent }}
          >
            Shakeb
          </a>
          <span className="text-sm" style={{ color: memColors.gray600 }}>
            for
          </span>
          
            <a href="https://mem.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-sm hover:underline transition-all"
            style={{ color: memColors.primary }}
          >
            Mem
          </a>
          <span className="text-sm" style={{ color: memColors.gray600 }}>
            users
          </span>
        </div>

        {/* Right: Social Links */}
        <div className="flex items-center gap-3">
          {links.map((link) => (
            <motion.a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg transition-all"
              style={{
                color: memColors.gray600,
                backgroundColor: memColors.gray100,
              }}
              title={link.label}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = memColors.primaryLight;
                e.currentTarget.style.color = memColors.accent;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = memColors.gray100;
                e.currentTarget.style.color = memColors.gray600;
              }}
            >
              <link.icon className="w-4 h-4" />
            </motion.a>
          ))}
        </div>
      </div>
    </motion.footer>
  );
}