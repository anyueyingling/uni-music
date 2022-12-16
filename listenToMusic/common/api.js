import { baseUrl } from './config.js';


export function topList(){
	return new Promise(function (resolve,reject){
		uni.request({
			url:`${baseUrl}/toplist/detail`,
			method:"GET",
			success:res=>{
				let result = res.data.list;
				result.length = 4;
				resolve(result);
			}
		})
	})
		
}
export function list(id){
	return uni.request({
		url:`${baseUrl}/playlist/detail?id=${id}`,
		method:'GET',
	})
}


// 歌单详情
export function songDetail(songId){
	return uni.request({
		url:`${baseUrl}/song/detail?ids=${songId}`,
		method:'GET',
	})
}
// 相似歌曲
export function songSimi(songId){
	return uni.request({
		url:`${baseUrl}/simi/song?id=${songId}`,
		method:'GET',
	})
}
// 歌曲评论
export function songComment(songId){
	return uni.request({
		url:`${baseUrl}/comment/music?id=${songId}`,
		method:'GET',
	})
}
// 歌曲歌词
export function songLyric(songId){
	return uni.request({
		url:`${baseUrl}/lyric?id=${songId}`,
		method:'GET',
	})
}
// 歌曲本身资源
export function songUrl(songId){
	return uni.request({
		url:`${baseUrl}/song/url?id=${songId}`,
		method:'GET',
	})
}
// 搜索热词
export function searchHot(){
	return uni.request({
		url:`${baseUrl}/search/hot/detail`,
		method:'GET'
	})
}
// 搜索热词
export function searchWord(word){
	return uni.request({
		url:`${baseUrl}/search?keywords=${word}`,
		method:'GET'
	})
}
// 搜索热词
export function searchSuggest(word){
	return uni.request({
		url:`${baseUrl}/search/suggest?keywords=${word}&type=mobile`,
		method:'GET'
	})
}
