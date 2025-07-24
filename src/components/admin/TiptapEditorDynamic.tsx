import dynamic from 'next/dynamic';
const TiptapEditorDynamic = dynamic(() => import('./TiptapEditor'), { ssr: false });
export default TiptapEditorDynamic; 