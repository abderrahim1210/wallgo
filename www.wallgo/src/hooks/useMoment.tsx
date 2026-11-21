import moment from 'moment';
import { useTranslation } from 'react-i18next';

const useMoment = () => {
    const { i18n } = useTranslation();
    const currentLang = i18n.language?.toLowerCase().startsWith('ar') ? 'ar' : 'en';
    return (date?: string | Date | null) =>
        moment.utc(date).local().locale(currentLang);
}

export default useMoment