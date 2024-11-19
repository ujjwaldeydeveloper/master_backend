import { getImageUrl } from '../utils/helper.js';

class NewsApiTransform {
    static transform(news) {
        return {
            id : news.id,
            heading : news.title,
            news : news.content,
            image: getImageUrl(news.image),
            created_at: news.created_at,
            reporter: {
                id: news?.user.id,
                name: news?.user.name,
                email: news?.user.email,
                profile: news?.user?.profile != null ? getImageUrl(news?.user?.profile) : "default image part",
            }
        }
    }
}

export default NewsApiTransform;