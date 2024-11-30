import React from 'react';
import { ExternalLink } from 'lucide-react';
import type { Template } from '../types';

interface TemplatePreviewProps {
  template: Template;
}

export default function TemplatePreview({ template }: TemplatePreviewProps) {
  return (
    <div className="group relative bg-gray-50 dark:bg-gray-700/50 rounded-lg overflow-hidden hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
      <div className="aspect-video">
        <img
          src={template.image}
          alt={template.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      
      <div className="p-4">
        <h4 className="font-medium text-gray-900 dark:text-white mb-1">
          {template.title}
        </h4>
        <div className="flex flex-wrap gap-2">
          <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
            {template.category}
          </span>
          <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs rounded-full">
            {template.format}
          </span>
        </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center gap-4 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
        <a
          href={template.canvaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 px-3 py-1.5 bg-[#00C4CC] text-white text-sm rounded-lg hover:bg-[#00B3B9] transition-colors"
        >
          Canva
          <ExternalLink className="w-4 h-4" />
        </a>
        <a
          href={template.figmaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 px-3 py-1.5 bg-black text-white text-sm rounded-lg hover:bg-gray-900 transition-colors"
        >
          Figma
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}