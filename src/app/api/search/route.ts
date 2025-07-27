import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '../../../lib/db';
import BlogPost from '../../../models/BlogPost';
import PressRelease from '../../../models/PressRelease';
import BrandStory from '../../../models/BrandStory';
import Product from '../../../models/Product';
import SearchKeyword from '../../../models/SearchKeyword';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const type = searchParams.get('type') || 'all';
    const lang = searchParams.get('lang') || 'ko';

    if (!query || query.trim().length === 0) {
      return NextResponse.json({
        success: false,
        error: '검색어가 필요합니다.'
      }, { status: 400 });
    }

    await dbConnect();

    // 검색 키워드 로깅 (비동기로 처리)
    addSearchKeyword(query.trim()).catch(error => {
      console.error('Error logging search keyword:', error);
    });

    const searchResults: any = {
      blog: [],
      press: [],
      brandStory: [],
      products: []
    };

    // 블로그 검색
    if (type === 'all' || type === 'blog') {
      const blogResults = await BlogPost.find({
        is_published: true,
        $or: [
          { [`title.${lang}`]: { $regex: query, $options: 'i' } },
          { [`content.${lang}`]: { $regex: query, $options: 'i' } },
          { [`excerpt.${lang}`]: { $regex: query, $options: 'i' } }
        ]
      }).sort({ created_at: -1 }).limit(10);

      searchResults.blog = blogResults.map(post => ({
        id: post._id,
        type: 'blog',
        title: post.title[lang],
        excerpt: post.excerpt[lang],
        slug: post.slug,
        created_at: post.created_at,
        image: post.image
      }));
    }

    // 언론보도 검색
    if (type === 'all' || type === 'press') {
      const pressResults = await PressRelease.find({
        is_published: true,
        $or: [
          { [`title.${lang}`]: { $regex: query, $options: 'i' } },
          { [`content.${lang}`]: { $regex: query, $options: 'i' } },
          { [`excerpt.${lang}`]: { $regex: query, $options: 'i' } }
        ]
      }).sort({ created_at: -1 }).limit(10);

      searchResults.press = pressResults.map(press => ({
        id: press._id,
        type: 'press',
        title: press.title[lang],
        excerpt: press.excerpt[lang],
        slug: press.slug,
        created_at: press.created_at,
        image: press.image
      }));
    }

    // 브랜드 스토리 검색
    if (type === 'all' || type === 'brand-story') {
      const brandStoryResults = await BrandStory.find({
        is_active: true,
        $or: [
          { [`title.${lang}`]: { $regex: query, $options: 'i' } },
          { [`content.${lang}`]: { $regex: query, $options: 'i' } },
          { [`excerpt.${lang}`]: { $regex: query, $options: 'i' } }
        ]
      }).sort({ created_at: -1 }).limit(10);

      searchResults.brandStory = brandStoryResults.map(story => ({
        id: story._id,
        type: 'brand-story',
        title: story.title[lang],
        excerpt: story.excerpt[lang],
        slug: story.slug,
        created_at: story.created_at,
        image: story.image
      }));
    }

    // 제품 검색
    if (type === 'all' || type === 'products') {
      const productResults = await Product.find({
        is_active: true,
        $or: [
          { [`name.${lang}`]: { $regex: query, $options: 'i' } },
          { [`description.${lang}`]: { $regex: query, $options: 'i' } },
          { [`features.${lang}`]: { $regex: query, $options: 'i' } }
        ]
      }).sort({ created_at: -1 }).limit(10);

      searchResults.products = productResults.map(product => ({
        id: product._id,
        type: 'product',
        name: product.name[lang],
        description: product.description[lang],
        slug: product.slug,
        created_at: product.created_at,
        image: product.image
      }));
    }

    // 전체 결과 수 계산
    const totalResults = 
      searchResults.blog.length + 
      searchResults.press.length + 
      searchResults.brandStory.length + 
      searchResults.products.length;

    return NextResponse.json({
      success: true,
      query,
      results: searchResults,
      total: totalResults,
      type,
      lang
    });

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({
      success: false,
      error: '검색 중 오류가 발생했습니다.'
    }, { status: 500 });
  }
}

// 검색 키워드 로깅 함수
async function addSearchKeyword(keyword: string) {
  try {
    await dbConnect();
    
    const existingKeyword = await SearchKeyword.findOne({ keyword });
    
    if (existingKeyword) {
      existingKeyword.count += 1;
      existingKeyword.lastUsed = new Date();
      await existingKeyword.save();
    } else {
      const newKeyword = new SearchKeyword({
        keyword,
        count: 1,
        lastUsed: new Date()
      });
      await newKeyword.save();
    }
  } catch (error) {
    console.error('Error adding search keyword:', error);
  }
} 