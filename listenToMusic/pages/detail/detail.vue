<template>
	<view class="detail">
		<view class="fixbg" :style="{backgroundImage:'url('+songDetail.al.picUrl +')'}"></view>
		<MusicHeader :title="songDetail.name" :icon="true" color="white"></MusicHeader>
		<view class="container" v-show="!isLoading">
				<scroll-view scroll-y="true" >
					<view class="detail-play" @tap="handleToPlay">
						<image :src="songDetail.al.picUrl" mode="" :class="{'detail-play-run':isPlayRotate}"></image>
						<text class="iconfont" :class="iconPlay"></text>
						<view :class="{'detail-play-neddle':isResolve ,'detail-play-back':isPlayBack}"></view>
					</view>
					<view class="detail-lyric">
						<view class="detail-lyric-wrap" :style="{transform : 'translateY('+ -(lyricIndex-1) *82 +'rpx)'}">
							<view class="detail-lyric-item" v-for="(item,index) in songLyric" :key="index" :class="{active:lyricIndex == index}">
								{{item.lyric}}
							</view>
						</view>
					</view>
					<view class="detail-like">
						<view class="detail-like-head">
							喜欢这首歌的人也听
						</view>
						<view class="detail-like-item" v-for="(item,index) in songSimi" :key="index" @tap="handleToSimi(item.id)">
							<view class="detail-like-img">
								<image :src="item.album.picUrl" mode=""></image>
							</view>
							<view class="detail-like-song">
								<view>{{item.name}}</view>
								<view>
									<image v-if="item.privilege.flag>60 && item.privilege.flag<70" src="../../static/dujia.png" mode=""></image>
									<image v-if="item.privilege.maxbr === 999000" src="../../static/sq.png" mode=""></image>
									{{item.album.artists[0].name}} - {{item.name}}
								</view>
							</view>
							<text class="iconfont icon-24gl-playCircle"></text>
						</view>
					</view>
					
					<view class="detail-comment">
						<view class="detail-comment-head">
							精彩评论
						</view>
						<view class="detail-comment-item" v-for="(item,index) in songComment" :key="index">
							<view class="detail-comment-img">
								<image :src="item.user.avatarUrl" mode=""></image>
							</view>
							<view class="detail-comment-content">
								<view class="detail-comment-title">
									<view class="detail-comment-name">
										<view>{{item.user.nickname}}</view>
										<view>{{item.time |formatTime}}</view>
									</view>
									<view class="detail-comment-like">
										{{item.likedCount |formatCount}}<text class="iconfont icon-dianzan"></text>
									</view>
								</view>
								<view class="detail-comment-text">
									{{item.content}}
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
		</view>
	</view>
</template>

<script>
	import MusicHeader from '../../components/MusicHeader/MusicHeader.vue'
	import '@/common/iconfont.css'
	import {songDetail,songSimi,songComment,songLyric,songUrl} from '../../common/api.js'
	export default {
		data() {
			return {
				songDetail:{
					al:{
						picUrl:''
					}
				},
				songSimi:[],
				songComment:[],
				songLyric:[],
				lyricIndex:0,
				iconPlay:'icon-zanting',
				//圆片旋转控制
				isPlayRotate:true,
				isResolve:false,
				isPlayBack:false,
				isLoading:true
			}
		},
		onLoad(options){
			//console.log(options.songId)	
			this.getMusic(options.songId);
		},
		onUnload(){
			this.clearLyricIndex();
			// #ifdef H5
			this.bgAudioManager.destroy();
			// #endif
		},
		onHide(){
			this.clearLyricIndex();
			// #ifdef H5
			this.bgAudioManager.destroy();
			// #endif
		},
		methods: {
			getMusic(songId){
				
				uni.showLoading({
					title:'加载中...'
				})
				this.isLoading = true;
				Promise.all([songDetail(songId),songSimi(songId),songComment(songId),songLyric(songId),songUrl(songId)]).then(res=>{
					//console.log(res);
					if(res[0][1].data.code == 200){
						this.songDetail = res[0][1].data.songs[0];
					}
					if(res[1][1].data.code ==200){
						this.songSimi = res[1][1].data.songs;
						//console.log(this.songSimi);
					}
					if(res[2][1].data.code ==200){
						this.songComment = res[2][1].data.hotComments;
					}
					if(res[3][1].data.code ==200){
						let lyric = res[3][1].data.lrc.lyric;
						//console.log(lyric);
						let re = /\[([^\]]+)\]([^\[]+)/g;
						var result=[];
						lyric.replace(re,($0,$1,$2)=>{
							result.push({'time':this.formatTimeToSec($1),'lyric':$2});
						})
						//console.log(result);
						this.songLyric = result;
					}
					if(res[4][1].data.code == 200){
						// #ifdef MP-WEIXIN
						this.bgAudioManager = uni.getBackgroundAudioManager();
						this.bgAudioManager.title = this.songDetail.name;
						// #endif
						
						// #ifdef H5
						if(!this.bgAudioManager){
							this.bgAudioManager = uni.createInnerAudioContext();
						}
						this.iconPlay = 'icon-24gl-playCircle';
						this.isPlayRotate = false;
						this.isResolve = true;
						// #endif
						//背景音频播放器，只对小程序使用，H5不适用。
						 
						 this.bgAudioManager.src = res[4][1].data.data[0].url || '';
						 this.listenLyricIndex();
						 // 播放的回调函数
						 this.bgAudioManager.onPlay(()=>{
							 this.iconPlay ='icon-zanting';
							 this.isPlayRotate = true;
							 this.isResolve = false;
							 this.isPlayBack = true;
							 this.listenLyricIndex();
							 console.log('我在播放音乐',this.isResolve);
							 console.log('我在播放音乐',this.isPlayBack);
						 });
						 // 暂停的回调函数
						 this.bgAudioManager.onPause(()=>{
							 this.iconPlay ='icon-24gl-playCircle';
							 this.isPlayRotate = false;
							 this.isResolve = true;
							 //this.isPlayBack = false;
						 })
					}
					this.isLoading = false;
					uni.hideLoading();
				})
			},
			// 将时间转换为秒
			formatTimeToSec(value){
				let arr = value.split(":");
				return ( Number(arr[0] * 60) + Number( arr[1]) ).toFixed(1);
			},
			handleToPlay(){
				if(this.bgAudioManager.paused){
					this.bgAudioManager.play();
				}else{
					this.bgAudioManager.pause();
				}
			},
			listenLyricIndex(){
				clearInterval(this.timer);
				this.timer = setInterval(()=>{
					for(var i = 0;i<this.songLyric.length;i++){
						if(this.bgAudioManager.currentTime > this.songLyric[this.songLyric.length-1].time){
							this.lyricIndex = this.songLyric.length-1;
						}
						if(this.bgAudioManager.currentTime > this.songLyric[i].time && this.bgAudioManager.currentTime < this.songLyric[i+1].time){
							this.lyricIndex = i;
						}
					}
					//console.log(this.lyricIndex);
				},500)
			},
			clearLyricIndex(){
				clearInterval(this.timer);
			},
			handleToSimi(songId){
				this.getMusic(songId);
			}
		}
	}
</script>

<style scoped>
	.detail-play{
		width:580rpx;
		height:580rpx;
		background: url('~@/static/disc.png');
		background-size:cover;
		margin:214rpx auto 0 auto;
		position: relative;
	}
	.detail-play image{
		width:370rpx;
		height:370rpx;
		border-radius: 50%;
		position:absolute;
		left:0;
		top:0;
		right:0;
		bottom:0;
		margin:auto;
		animation: 10s linear move infinite;
		animation-play-state: paused;	
	}
	.detail-play .detail-play-run{
		animation-play-state: running;	
	}
	@keyframes move {
		from{ transform: rotate(0deg);}
		to{ transform: rotate(360deg);}
	}
	.detail-play text{
		width:100rpx;
		height:100rpx;
		font-size:100rpx;
		color:white;
		position:absolute;
		left:0;
		top:0;
		right:0;
		bottom:0;
		margin:auto;
	}
	.detail-play view{
		width:230rpx;
		height:360rpx;
		background: url('../../static/needle.png');
		position:absolute;
		left:100rpx;
		right:0;
		top:-200rpx;
		margin:auto;
		background-size:cover;		
	}
	.detail-play .detail-play-neddle{
		transform-origin: 18% 6%;
		animation:revolve 0.5s ease-in-out forwards;
	}
	..detail-play .detail-play-back{
		animation:back 0.5s ease-in-out forwards;
	}
	@keyframes revolve {
		from{ transform: rotate(0deg);}
		to{ transform: rotate(-20deg);}
	}
	@keyframes back{
		from{ transform: rotate(0deg);}
		to{ transform: rotate(-30deg);}
	}
	.detail-lyric{
		font-size:32rpx;
		line-height: 82rpx;
		height:246rpx;
		text-align: center;
		overflow: hidden;
		color:#949495;
	}
	.active{ color:white;}
	.datail-lyric-wrap{ transition: 0.2s;}
	.datail-lyric-item{height:82rpx;}
	
	.detail-like{margin:0 30rpx;}
	.detail-like-head{ font-size:36rpx;color:white;margin:50rpx 0;}
	.detail-like-item{ display:flex;align-items: center; margin-bottom:28rpx;}
	.detail-like-img{ width:82rpx; height:82rpx; border-radius: 20rpx; overflow: hidden; margin-right:20rpx;}
	.detail-like-song{flex:1; color:#c6c2bf}
	.detail-like-song view:nth-child(1){ font-size:28rpx; color:white; margin-bottom:12rpx;}
	.detail-like-song view:nth-child(2){ font-size:22rpx;}
	.detail-like-song image{ width:26rpx; height:20rpx; margin-right:10rpx;}
	.detail-like-item text{ font-size:50rpx;color:#c6c2bf;}
	
	.detail-comment{ margin:0 30rpx;}
	.detail-comment-head{ font-size:36rpx;color:white;margin:50rpx 0;}
	.detail-comment-item{ margin-bottom:28rpx;display:flex;}
	.detail-comment-img{ width:64rpx; height: 64rpx;border-radius: 50%; overflow: hidden;margin-right:18rpx;}
	.detail-comment-img image{width:100%; height:100%;}
	.detail-comment-content{ flex:1; color:#cbcacf;}
	.detail-comment-title{ display:flex; justify-content: space-between;}
	.detail-comment-name{}
	.detail-comment-name view:nth-child(1){font-size:26rpx;}
	.detail-comment-name view:nth-child(2){font-size:26rpx;}
	.detail-comment-like{font-size:28rpx;}
	.detail-comment-text{font-size:28rpx; line-height:40rpx;color:white;margin-top:20rpx;border-bottom:1px #e0e0e0 solid;padding-bottom:40rpx;}
</style>
