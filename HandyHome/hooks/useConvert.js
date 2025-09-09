// Hook: Value Converter

// Import
// ---- React Components
import { useState, useCallback } from "react";

export const useConvert = () => {
   
   // * DATE TO TIME (24 HOUR)
   const convertDateToTime24 = useCallback((dateObject) => {
      if (!dateObject || !(dateObject instanceof Date) || isNaN(dateObject.getTime())) {
         return '';
      }

      const hours = String(dateObject.getHours()).padStart(2, '0');
      const minutes = String(dateObject.getMinutes()).padStart(2, '0');

      return `${hours}:${minutes}`;
   }, []);

   // * DATE TO TIME (12 HOUR)
   const convertDateToTime12 = useCallback((dateObject) => {
      if (!dateObject || !(dateObject instanceof Date) || isNaN(dateObject.getTime())) {
         return '';
      }

      let hours = dateObject.getHours();
      const minutes = String(dateObject.getMinutes()).padStart(2, '0');
      const meridiem = hours >= 12 ? 'PM' : 'AM'

      hours = hours % 12;
      hours = hours ? hours : 12;
      const formattedHours = String(hours).padStart(2, '0');

      return `${formattedHours}:${minutes} ${meridiem}`;
   }, []);

   // * DATE TO FORMATTED DATE (MM-DD-YYYY)
   const convertDateToFormattedDate = useCallback((dateObject, format = '-') => {
      if (!dateObject || !(dateObject instanceof Date) || isNaN(dateObject.getTime())) {
         return '';
      }

      const monthNames = [
         'January', 'February', 'March', 'April', 'May', 'June',
         'July', 'August', 'September', 'October', 'November', 'December'
      ];

      const month = String(dateObject.getMonth() + 1).padStart(2, '0');
      const day = String(dateObject.getDate()).padStart(2, '0');
      const year = dateObject.getFullYear();

      // Handle long format: January 01, 2004
      if (format === 'long') {
         const monthName = monthNames[dateObject.getMonth()];
         return `${monthName} ${day}, ${year}`;
      }

      // Original separator-based format
      return `${month}${format}${day}${format}${year}`;
   }, []);

   // * URI TO FILE (Single)
   const convertUriToFile = useCallback((uri, fileName = null) => {
      if (!uri || typeof uri !== 'string') {
         return null;
      }

      try {
         const getFileExtension = (uri) => {
            const parts = uri.split('.');
            return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : 'jpg';
         };

         const generateFileName = (extension) => {
            const timestamp = Date.now();
            const randomString = Math.random().toString(36).substring(2, 15);
            return `file_${timestamp}_${randomString}.${extension}`
         };

         const extension = getFileExtension(uri);
         const name = fileName || generateFileName(extension);

         const getMimeType = (extension) => {
            const mimeTypes = {
               'jpg': 'image/jpeg',
               'jpeg': 'image/jpeg',
               'png': 'image/png',
               'gif': 'image/gif',
               'bmp': 'image/bmp',
               'webp': 'image/webp',
               'svg': 'image/svg+xml',
               'pdf': 'application/pdf',
               'doc': 'application/msword',
               'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
               'txt': 'text/plain',
               'mp4': 'video/mp4',
               'mov': 'video/quicktime',
               'avi': 'video/x-msvideo',
               'mp3': 'audio/mpeg',
               'wav': 'audio/wav',
            };

            return mimeTypes[extension] || 'application/octet-stream';
         };

         const fileObject = {
            uri: uri,
            name: name,
            type: getMimeType(extension),
         };

         console.log(fileObject);
         return fileObject;
      } catch (err) {
         console.error('Error transforming URI to File Object:', err);
         return null;
      }
   }, [])

   // * URIs TO FILE (Multiple)
   const convertUrisToFiles = useCallback((uris, fileNames = []) => {
      if (!Array.isArray(uris)) {
         return [];
      }

      return uris
         .map((uri, index) => convertUriToFile(uri, fileNames[index]))
         .filter(file => file !== null);
   }, [convertUriToFile]);


   // RETURNS
   return {
      convertDateToTime12,
      convertDateToTime24,
      convertDateToFormattedDate,
      convertUriToFile,
      convertUrisToFiles
   }
}