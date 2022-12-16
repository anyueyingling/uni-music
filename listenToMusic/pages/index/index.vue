<template>
	<view class="content">
		<MusicHeader title="网易云音乐" :icon="false"></MusicHeader>
		<view class="contaniner">
			<scroll-view scroll-y="true" >
				<view class="index-search" @tap="handleToSearch">
					<text class="iconfont icon-fangdajing"></text>
					<input type="text" placeholder="搜索歌曲"/>
				</view>
				<view class="index-list" > 
					<view class="index-list-item" v-for="(item,index) in topList" :key="index" @tap="handleToList(item.id)">
						<view class="index-list-img">
							<img :src="item.coverImgUrl">
							<text>{{item.updateFrequency}}</text>
						</view>
						<view class="index-list-text">
							<view v-for="(track,index) in item.tracks" :key="track.index">{{index+1}},{{track.first}} - {{track.second}}</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import '@/common/iconfont.css';
	import MusicHeader from '../../components/MusicHeader/MusicHeader.vue'
	import {topList} from '../../common/api.js'
	export default {
		data() {
			return {
				topList:[]
			}
		},
		components:{
			MusicHeader,
		},
		onLoad() {
			topList().then((res)=>{
				if(res.length){
					this.topList = res;	
				}
				//console.log(res);
			});
		},
		methods: {
			handleToList(id){
				uni.navigateTo({
					url:'/pages/list/list?id='+id
				})
			},
			handleToSearch(){
				uni.navigateTo({
					url:'/pages/search/search'
				})
			}
		}
	}
</script>

<style scoped>
	.index{}
	.index-search{
		display:flex;
		align-items:center;
		height:70rpx;
		margin:70rpx 30rpx 30rpx 70rpx;
		background:#f7f7f7;
		border-radius:50rpx;
	}
	.index-search text{
		font-size:26rpx;
		margin-right:26rpx;
		margin-left:28rpx;
	}
	.index-search input{
		font-size:28rpx;
		flex:1;
	}
	.index-list{
		margin:0 30rpx;
	}
	.index-list-item{
		display:flex;
		margin-bottom:34rpx;
	}
	.index-list-img{
		width:212rpx;
		height:212rpx;
		position:relative;
		border-radius:30rpx;
		overflow:hidden;
		margin-right: 22rpx;
		flex-shrink: 0;
	}
	.index-list-img image{
		width:100%;
		height:100%;
	}
	.index-list-img text{
		position:absolute;
		left:12rpx;
		bottom:16rpx;
		color:white;
		font-size:20rpx;
	}
	.index-list-text{
		font-size: 24rpx;
		line-height:66rpx;
		overflow:hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
