<<<<<<< HEAD
// utils/types.ts
=======
>>>>>>> c9ca3fd252d81f5024c9bd39ccf02d3ebf789335
export type PDF = {
  id?: number;
  name: string;
  size: number;
  lastModified: number;
  data: ArrayBuffer;
  status: 'to-study' | 'done';
  dateAdded: number;
<<<<<<< HEAD
  classId: number;
=======
  classId?: number;
>>>>>>> c9ca3fd252d81f5024c9bd39ccf02d3ebf789335
}

export type Class = {
  id?: number;
  name: string;
  dateCreated: number;
  pdfCount: number;
<<<<<<< HEAD
  doneCount?: number;
  progress?: number;
=======
>>>>>>> c9ca3fd252d81f5024c9bd39ccf02d3ebf789335
}