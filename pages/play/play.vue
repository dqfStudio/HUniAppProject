<template>
	<view class="play-page" :style="{height:winHeight + 'px'}">
		<view class="status-bar" :style="{height:statusBarHeight + 'px'}"></view>
		<view style="position: relative;">
			<view v-if="!isVideo" style="width:750rpx;height:421rpx;">
				<image class="video-advert-img" :src="getImageUrl(videoInfo.image)" :lazy-load="true" mode="aspectFill"></image>
			</view>
			
			<view class="play-vedio" style="position: relative;">
				<!-- 视频播放器 -->
				<div id="videoContext" class="play-vedio dplayer-hide-controller"></div>
				
				<!-- 视频加载动画 -->
				<!-- <view v-if="isVideoLoading" style="width:750rpx;height:421rpx;position:absolute;left:0;top:0;justify-content:center;align-items:center;display:flex;flex-direction:column;z-index: 1;">
					<image style="width:100rpx;height:100rpx;" src="/static/loading.gif"></image>
				</view>
 -->
				<!-- 视频初始背景图-点击播放 -->
				<view class="video-advert" v-if="showVideoDefault&&!isVideoLoading">
					<image class="video-advert-img" :src="getImageUrl(videoInfo.image)" :lazy-load="true" mode="aspectFill"></image>
				</view>
				<view v-if="showVideoDefault&&(userInfo.is_vip===1||leftoverPlayNumber>0)&&!isVideoLoading" style="width:750rpx;height:421rpx;position:absolute;left:0;top:0;justify-content:center;align-items:center;background-color:rgba(0, 0, 0, .7);display:flex;flex-direction:column;z-index: 1;">
					<image style="width:120rpx;height:120rpx;margin-bottom:10rpx;" @click.stop="onClickPlay" src="../../static/icon-play-1.png" mode="widthFix"></image>
					<view class="flex-row" style="height: 40rpx;">
						<text class="video-play-text">今日免费观影次数：</text>
						<text class="video-play-number">{{isVip===1?'无限':leftoverPlayNumber}}</text>
					</view>
				</view>
				<!-- 普通用户次数用完但视频可以完整播放 -->
				<view class="video-cover" v-if="showVideoDefault&&userInfo.is_vip!==1&&leftoverPlayNumber===0&&userWatchAuthority===2">
					<image class="video-play" @click.stop="onClickPlay" src="../../static/icon-play-1.png" mode="widthFix"></image>
				</view>
				<!-- 普通用户观影次数用完初始提示 -->
				<view class="video-cover" v-if="showVideoDefault&&userInfo.is_vip!==1&&leftoverPlayNumber===0&&userWatchAuthority===1">
					<view><text class="haveatry-tip-text1" style="height:40rpx;">观影次数已用完！</text></view>
					<view><text class="haveatry-tip-text2" style="margin-top:20rpx;height:40rpx;">开通VIP享受无限观影、专享资源等特权！</text></view>
					<view class="flex-row" style="margin-top:40rpx;">
						<view class="haveatry-tip-btn1">
							<text class="haveatry-tip-btn-text" @click.stop="onClickPlay">点击试看</text>
						</view>
						<view class="haveatry-tip-btn2" style="margin-left:40rpx;" @click.stop="toPayVip">
							<text class="haveatry-tip-btn-text" style="color: #ff7f00;">立即开通</text>
						</view>
					</view>
				</view>

				<!-- vip视频和付费视频右上角标示 -->
				<view style="position:absolute;top:10rpx;right:10rpx;z-index: 1;">
					<text v-if="isCharge===2&&!userIsCharge&&userWatchAuthority===1" class="video-pay-btn" @click.stop="toPayTip">购买视频 观看完整版</text>
					<text v-if="isCharge===3&&userInfo.is_vip!==1&&userWatchAuthority===1" class="video-pay-btn" @click.stop="toPayVip">开通VIP 观看完整版</text>
				</view>

				<!-- 视频暂停广告- -->
				<view class="video-advert video-advert-stop" style="left:375rpx;top:210rpx;z-index: 1;" v-if="stopAdvert&&videoPlayState===1">
					<a v-if="isExternalLink(stopAdvert.url)" style="display: block;" :href="stopAdvert.url" target="_blank" @click.stop="goAdvertPage(stopAdvert.url,stopAdvert.id)">
						<image class="video-advert-top-img" :src="getImageUrl(stopAdvert.image)" mode="aspectFill"></image>
					</a>
					<image v-else class="video-advert-top-img" :src="getImageUrl(stopAdvert.image)" @click.stop="goAdvertPage(stopAdvert.url,stopAdvert.id)" mode="aspectFill"></image>
					
					<uni-icons @click="closeAdvert" type="clear" size="24" color="rgba(0,0,0,.5)" style="position:absolute;right:0;top:0;z-index:99;"></uni-icons>
				</view>

				<!-- 视频结束提示-背景广告 -->
				<view class="video-cover" style="background-color: #000000;width:750rpx;height:421rpx;" v-if="(userWatchAuthority===1&&videoPlayState===3)||(userWatchAuthority===2&&videoPlayState===2)">
					<image v-if="videoInfo.recommend_video_end_not_fs_advert" :style="{width:'750rpx',height:'421rpx'}" :src="getImageUrl(videoInfo.recommend_video_end_not_fs_advert.image)" :lazy-load="true" mode="aspectFill"></image>
				</view>
				<!-- 试看结束提示 -->
				<view style="width: 750rpx;height: 421rpx;position: absolute;top: 0;left: 0;justify-content: center;align-items: center;background-color: rgba(0, 0, 0, .7); margin: 0;display:flex;z-index: 1;" v-if="userWatchAuthority===1&&videoPlayState===3">
					<view style="width: 750rpx;height: 421rpx;justify-content: center; align-items: center;display:flex;flex-direction: column;"  @click.stop="goAdvertPageClick">
						<!-- 非vip试看免费视频或者vip资源视频 -->
						<template v-if="userInfo.is_vip!==1&&isCharge!==2">
							<text class="haveatry-tip-text1" style="height:40rpx;">试看已结束！</text>
							<text class="haveatry-tip-text2" style="margin-top:20rpx;height:40rpx;">开通VIP享受无限观影、专享资源等特权！</text>
							<view class="flex-row" style="margin-top:40rpx;">
								<view class="haveatry-tip-btn1" @click.stop="onClickReplay">
									<!-- <uni-icons type="refreshempty" size="24" color="#ff7f00"></uni-icons> -->
									<text class="haveatry-tip-btn-text">重新播放</text>
								</view>
								<view class="haveatry-tip-btn2" style="margin-left:40rpx;" @click.stop="toPayVipClick">
									<text class="haveatry-tip-btn-text" style="color: #ff7f00;">立即开通</text>
								</view>
							</view>
						</template>
						<!-- 非vip试看收费视频 -->
						<template v-if="userInfo.is_vip!==1&&isCharge===2">
							<text class="haveatry-tip-text1" style="height:40rpx;">试看已结束！</text>
							<text class="haveatry-tip-text2" style="margin-top:20rpx;height:40rpx;">开通VIP付费视频享折扣</text>
							<view class="flex-row" style="margin-top:40rpx;">
								<view class="haveatry-tip-btn1" @click.stop="toPayVipTipClick">
									<text class="haveatry-tip-btn-text">原价购买</text>
								</view>
								<view class="haveatry-tip-btn2" style="margin-left:40rpx;" @click.stop="toPayVipClick">
									<text class="haveatry-tip-btn-text" style="color: #ff7f00;">开通VIP</text>
								</view>
							</view>
						</template>
						<!-- vip试看收费视频 -->
						<template v-if="userInfo.is_vip===1&&isCharge===2">
							<text class="haveatry-tip-text1" style="height:40rpx;">试看已结束！</text>
							<text class="haveatry-tip-text2" style="margin-top:20rpx;height:40rpx;">购买视频观看精彩完整版！</text>
							<view class="flex-row" style="margin-top:40rpx;">
								<view class="haveatry-tip-btn1" @click.stop="onClickReplay">
									<!-- <uni-icons type="refreshempty" size="24" color="#ff7f00"></uni-icons> -->
									<text class="haveatry-tip-btn-text">重新播放</text>
								</view>
								<view class="haveatry-tip-btn2" style="margin-left:40rpx;" @click.stop="toPayVipTipClick">
									<text class="haveatry-tip-btn-text" style="color: #ff7f00;">立即购买</text>
								</view>
							</view>
						</template>
					</view>
				</view>
				<!-- 影片观看结束 -->
				<view style="width: 750rpx;height: 421rpx;position: absolute;top: 0;left: 0;justify-content: center;align-items: center;background-color: rgba(0, 0, 0, .7); margin: 0;display:flex;z-index: 1;" v-if="userWatchAuthority===2&&videoPlayState===2">
					<view style="width: 750rpx;height: 421rpx;justify-content: center; align-items: center;display:flex;" @click.stop="goAdvertPageClick">
						<view class="flex-row" style="margin-top:40rpx;">
							<view class="haveatry-tip-btn1" @click.stop="onClickReplay">
								<text class="haveatry-tip-btn-text">重新播放</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 视频播放广告 -->
			<view v-if="showVideoAdvert" style="width:750rpx;height:421rpx;z-index:19;position:absolute;left:0;top:0;background-color:#FFFFFF;z-index: 1;">
				<!-- 图片广告 -->
				<template v-if="playAdvert&&!playVideoAdvert">
					<a v-if="isExternalLink(playAdvert.url)" style="display: block;" :href="playAdvert.url" target="_blank" @click.stop="goAdvertPage(playAdvert.url,playAdvert.id)">
						<image class="video-advert-img" :src="getImageUrl(playAdvert.image)" mode="aspectFill"></image>
					</a>
					<image v-else class="video-advert-img" :src="getImageUrl(playAdvert.image)" @click.stop="goAdvertPage(playAdvert.url,playAdvert.id)" mode="aspectFill"></image>
					<view class="count-down">
						<text class="count-down-text" v-if="advertTime!==0">{{advertTime}}秒</text>
					</view>
				</template>
				<!-- 视频广告 -->
				<template v-else-if="playAdvert&&playVideoAdvert">
					<div id="videoAdvert" class="play-vedio dplayer-hide-controller"></div>
					<view style="width:750rpx;height:421rpx;position:absolute;left:0;top:0;z-index: 1;"></view>
					<view class="count-down" style="z-index: 1;">
						<text class="count-down-text" v-if="advertTime!==0">{{advertTime}}秒</text>
						<text class="count-down-text" @click.stop="handleVideoAdvertEnded" v-else>跳过</text>
					</view>
				</template>
				<template v-else>
					<image class="video-advert-img" :src="getImageUrl('')" mode="aspectFill"></image>
				</template>
			</view>
			
			<view v-if="videoLoadingResult===-1||videoLoadingResult===-2||videoLoadingResult===-3" style="width:750rpx;height:421rpx;position:absolute;left:0;top:0;justify-content:center;align-items:center;background-color:#000;display:flex;z-index: 1;">
				<view class="haveatry-tip-btn2" @click.stop="reloadVideoInfo">
					<text class="haveatry-tip-btn-text" style="color: #ff7f00;">重新加载</text>
				</view>
			</view>
			
			<!-- 视频返回 -->
			<view class="video-back" @click.stop="toHome">
				<image class="video-back-img" src="../../static/icon-back.png"></image>
			</view>
		</view>
		<!-- 视频 评论 -->
		<view class="tabs">
			<view class="tab-header">
				<view class="tab-header-item" @click="onClickTab(0)">
					<view class="tab-header-tbox">
						<text class="tab-header-text">视频</text>
						<view class="tab-header-text-active" v-if="tabIndex==0"></view>
					</view>
				</view>
				<view class="tab-header-item" @click="onClickTab(1)">
					<view class="tab-header-tbox">
						<text class="tab-header-text">评论</text>
						<view class="tab-header-text-active" v-if="tabIndex==1"></view>
					</view>
					<text v-if="commentNum>0" class="tab-header-count">{{commentNum}}</text>
				</view>
				<!-- <view class="tab-header-item" @click="onClickTab(2)">
					<view class="tab-header-tbox">
						<text class="tab-header-text">游戏</text>
						<view class="tab-header-text-active" v-if="tabIndex==2"></view>
					</view>
				</view> -->
			</view>
			<swiper class="tab-view" :current="tabIndex" :duration="300" @change="onChangeTabPage">
				<swiper-item>
					<!-- 视频信息 -->
					<scroll-view class="scroll-view" style="height: 100%;" :scroll-y="true" :show-scrollbar="false">
						<view style="padding-left: 30rpx; padding-right: 30rpx;">
							<image v-if="advertBanner" @click="goAdvertPage(advertBanner.url,advertBanner.id)" class="advert-img" :src="getImageUrl(advertBanner.image)" :lazy-load="true" mode="aspectFill"></image>
							<text class="video-name">{{videoName}}</text>
							<view class="flex-row" style="margin-top: 16rpx;align-items:center;">
								<image style="width: 18rpx; height: 23rpx; margin-right: 4rpx;" src="../../static/icon-play-3.png" mode="widthFix"></image>
								<text class="video-info-text">播放：{{numberCount(playNum)}}</text>
								<text class="video-info-text" v-if="videoInfo.is_charge===2">{{numberCount(videoInfo.buy_num)}}人已购</text>
								<text class="video-info-text" v-if="videoTime">{{dateTimeFun(videoTime)}}</text>
							</view>
							<view v-if="lables.length>0" class="flex-row" style="margin-top:12rpx;flex-wrap:wrap;">
								<text v-for="(item, index) in lables" :key="index" class="video-lable">{{item.name}}</text>
							</view>
							<view class="video-count">
								<view class="video-count-item" @click="praiseStatus===1 ? optCancelLike() : optLike()">
									<image v-if="praiseStatus===1" class="video-count-icon" src="../../static/icon-like-4.png" mode="widthFix"></image>
									<image v-else class="video-count-icon" src="../../static/icon-like-3.png" mode="widthFix"></image>
									<text class="video-count-text">{{numberCount(praiseNum)}}</text>
								</view>
								<view class="video-count-item" @click="downloadTip">
									<image class="video-count-icon" src="../../static/icon-download.png" mode="widthFix"></image>
									<text class="video-count-text">缓存</text>
								</view>
								<view class="video-count-item" @click="toSharePage">
									<image class="video-count-icon" src="../../static/icon-share-1.png" mode="widthFix"></image>
									<text class="video-count-text" style="color: #B4B4B4;">分享</text>
								</view>
								<view class="video-count-item" @click="isCharge===2?toPayTip():toPayVip()">
									<template v-if="isCharge===3">
										<image class="video-count-icon" src="../../static/icon-ktvip.png" mode="widthFix"></image>
										<text class="video-count-text">{{userInfo.is_vip===1?'VIP专享':'开通会员'}}</text>
									</template>
									<template v-else-if="isCharge===2">
										<image class="video-count-icon" src="../../static/icon-money.png" mode="widthFix"></image>
										<text class="video-count-text">{{userIsCharge ? '已支付' : '立即支付'}}</text>
										<view class="redSize" v-if="!userIsCharge">
											<image class="redSize-image" src="../../static/payForVideo.png" mode="widthFix"></image>
											<text class="redSize-text">{{chargeMoney / 100}}金币</text>
										</view>
									</template>
									<template v-else>
										<image class="video-count-icon" src="../../static/icon-ktvip.png" mode="widthFix"></image>
										<text class="video-count-text">VIP特权</text>
									</template>
								</view>
							</view>
						</view>
						
						<!-- 游戏推荐 -->
						<view v-if="$store.state.userInfo.game_status != 2">
							<view v-if="videoName" style="width: 750rpx;">
								<game-list :isHeader="false"></game-list>
							</view>
						</view>
						<!-- <view style="position: relative;">
							<image style="background-color: #007AFF;width: 375px;height: 200rpx;position: absolute;" :src="getImageUrl('/static/play/icon_bet_sp_bg3.png')" mode="aspectFill">
								<view style="margin: 40rpx 30rpx;background-color: #FFFFFF;border-radius: 10rpx;box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.2);">
									<swiper style="height: 200rpx;display: flex;flex-direction: column;" :duration="3000" :vertical="true" :autoplay="true" :circular="true">
										<swiper-item v-for="(item, index) in betList" style="height: 50rpx;">
											<view v-for="(row, idx) in item.list" style="display: flex;flex-direction: row;justify-content: space-between;margin: 10rpx 20rpx;margin-top: 10rpx;">
												<view style="display: flex;flex-direction: row;">
													<text style="color: #292727; font-size: 20rpx;">恭喜</text>
													<text style="color: #F09450; font-size: 20rpx;">“{{row.name}}”</text>
													<text style="color: #292727; font-size: 20rpx;">在</text>
													<text style="color: #292727; font-size: 20rpx;">“{{row.gameName}}”</text>
													<text style="color: #F09450; font-size: 20rpx;">中了</text>
													<text style="color: #EC4357; font-size: 20rpx;padding-left: 10rpx;">{{row.winNum}}</text>
													<text style="color: #292727; font-size: 20rpx;">元</text>
												</view>
												<view style="width: 90rpx;15prx;border-radius: 100%;background-image: linear-gradient(to right , #F4B23E, #EF8E36);" @click="followBet">
													<text style="color: #FFFFFF; font-size: 20rpx; text-align: center;">跟投</text>
												</view>
											</view>
										</swiper-item>
									</swiper>
								</view>
							</image>
						</view> -->
						
						<!-- 相关推荐 -->
						<view class="remd" style="padding-left: 30rpx; padding-right: 30rpx;" v-if="recommendList.length > 0">
							<view class="remd-header">
								<view class="remd-header-row" style="flex: 1;align-items: center;">
									<image style="width:6rpx;height:34rpx;" src="../../static/topic-icon.png" mode="widthFix"></image>
									<text class="remd-header-title">相关推荐</text>
								</view>
								<!-- <view class="remd-header-row" style="flex-shrink: 0;">
									<text class="remd-header-more">换一换</text>
									<image style="width: 25rpx;" src="../../static/icon-loop.png" mode="widthFix"></image>
								</view> -->
							</view>
							<view class="remd-content">
								<view class="remd-item" v-for="(item, index) in recommendList" :key="index" @click="toPlay(item.id)">
									<view class="remd-item-box">
										<image class="remd-item-img" :src="getImageUrl(item.image)" :lazy-load="true" mode="aspectFill"></image>
										<!-- 角标 -->
										<video-item-sub :is_charge="item.is_charge" :charge="item.charge"></video-item-sub>
										<!-- 数据信息 -->
										<view class="remd-item-info">
											<view class="remd-item-info-row">
												<template v-if="item.is_charge===2">
													<text class="remd-item-info-text">{{numberCount(item.buy_num)}}人已购</text>
												</template>
												<template v-else>
													<image style="width:26rpx;height:26rpx;" src="../../static/icon-play.png" mode="widthFix"></image>
													<text class="remd-item-info-text">{{numberCount(item.play_num)}}</text>
												</template>
											</view>
											<text class="remd-item-info-text">{{item.time_length}}</text>
										</view>
									</view>
									<text class="remd-item-title">{{item.name}}</text>
								</view>
							</view>
							<text class="endText" style="display: block;">没有更多了</text>
						</view>
					</scroll-view>
				</swiper-item>
				<swiper-item>
					<!-- 评论 -->
					<scroll-view class="comment" style="height: 100%;" :scroll-y="true" :show-scrollbar="false" @scrolltolower="loadMore">
						<view v-if="commentList.length===0" style="text-align: center; padding-top: 100rpx;">
							<text style="font-size: 28rpx; color: #999999;">暂无评论</text>
						</view>
						<view class="comment-item" v-for="(item, index) in commentList" :key="index">
							<image class="comment-item-headimg" :src="getImageUrl((item.user&&item.user.image)||'/static/headimg-default.png')" :lazy-load="true" mode="aspectFill"></image>
							<view class="comment-item-content">
								<text class="comment-item-name">{{item.user&&item.user.name}}</text>
								<text class="comment-item-text">{{item.comment}}</text>
							</view>
							<text class="comment-item-time" v-if="item.created_at">{{dateTimeFun(item.created_at)}}</text>
						</view>
						<view class="loading-more" style="text-align: center;" v-if="commentIsLoaded&&commentList.length>0">
							<uni-load-more :status="commentLoadMoreStatus" />
						</view>
					</scroll-view>
				</swiper-item>
				<swiper-item>
					<!-- 游戏 -->
					<list class="comment" :show-scrollbar="false" @loadmore="loadMore" :loadmoreoffset="15"></list>
				</swiper-item>
			</swiper>
			<!-- 评论输入框 -->
			<view :style="{height:(safeAreaHeight+60) + 'px'}">
				<view class="fixed-comment" :style="{paddingBottom:(keyboardheight+12) + 'px'}">
					<view class="comment-opt" @click="showVipTip(userInfo.is_vip===2)">
						<view class="comment-textarea">
							<textarea class="comment-input" ref="commentInput" @click="showVipTip(userInfo.is_vip===2)" placeholder="请输入评论内容" :disabled="userInfo.is_vip===2 || (comment_config.status == 2)" :value="commentInputValue" :adjust-position="false" :auto-height="true" @focus="handleFocus" @blur="handleBlur" @input="handleInputChange" @confirm="handleConfirm" :maxlength="comment_config.word_count || 0" @keyboardheightchange="keyboardheightchange"></textarea>
						</view>

						<text v-if="commentInputIsFocus||(!commentInputIsFocus&&commentInputValue!=='')" class="comment-send" :class="{'comment-send-active': commentInputValue!==''}" @click="sendComment">发送</text>
						<image v-if="!commentInputIsFocus&&commentInputValue===''" class="comment-input-edit" src="../../static/icon-edit-1.png" mode="widthFix"></image>
					</view>
					<view :style="{height:safeAreaHeight + 'px'}"></view>

					<view v-if="comment_config.status == 2" class="hide_textarea" @click="showInputToast"></view>
				</view>
			</view>
		</view>

		<!-- 开通vip提示-评论 -->
		<uni-popup ref="modalKtvip">
			<modal-ktvip @confirm="toPayVip"></modal-ktvip>
		</uni-popup>
		<!-- 开通vip提示-超清 -->
		<uni-popup ref="modalKtvipClarity">
			<modal-ktvip @confirm="toPayVip" :type="1"></modal-ktvip>
		</uni-popup>
		<!-- 缓存界面 -->
		<uni-popup ref="modalCache">
			<modal-cache @confirm="download" @onReceive="toPayVip" :type="modalCacheType" :isVip="userInfo.is_vip===1" :isCharge="videoInfo.is_charge===2" :money="(videoInfo.is_charge===2?videoInfo.charge:videoInfo.paid_resources)||0" :vipMoney="+(videoInfo.is_charge===2?videoInfo.vip_charge:videoInfo.vip_paid_resources)||0" :balance="userInfo.money||0" :coupon="userInfo.download_ticket||0" :sumcoupon="userInfo.count_coupon||0"></modal-cache>
		</uni-popup>

		<!-- 购买提示 -->
		<uni-popup ref="modalPay">
			<!-- 	普通用户-余额足够 -->
			<modal-pay v-if="userInfo.is_vip===2&&(userInfo.money||0)>=chargeMoney" :type="0" :money="chargeMoney" :vipMoney="+chargeVipMoney" :balance="userInfo.money||0" okText="开通VIP" closeText="原价购买" @confirm="toPayVip" @close="confirmPay" :beforeClose="true"></modal-pay>
			<!-- 	普通用户-余额不足 -->
			<modal-pay v-if="userInfo.is_vip===2&&(userInfo.money||0)<chargeMoney" :type="1" :money="chargeMoney" :vipMoney="+chargeVipMoney" :balance="userInfo.money||0" okText="立即充值" @confirm="toPayVip(1)"></modal-pay>

			<!-- vip用户-余额足够 -->
			<modal-pay v-if="userInfo.is_vip===1&&(userInfo.money||0)>=chargeVipMoney" :type="2" :isVip="true" :money="chargeMoney" :vipMoney="+chargeVipMoney" :balance="userInfo.money||0" @confirm="confirmPay"></modal-pay>
			<!-- vip用户-余额不足 -->
			<modal-pay v-if="userInfo.is_vip===1&&(userInfo.money||0)<chargeVipMoney" :type="3" :isVip="true" :money="chargeMoney" :vipMoney="+chargeVipMoney" :balance="userInfo.money||0" okText="立即充值" @confirm="toPayVip(1)"></modal-pay>
		</uni-popup>
	</view>
</template>

<script>
	const deviceInfo = uni.getSystemInfoSync();
	import http from '@/utils/request.js';
	import config from '@/utils/config.js';
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue";
	import uniIcons from "@/components/uni-icons/uni-icons.vue";
	import modalKtvip from '@/components/modal/modal-ktvip.vue';
	import modalPay from '@/components/modal/modal-pay.vue';
	import modalCache from '@/components/modal/modal-cache.vue';
	import gameList from '@/pages/home/game-list.nvue';
	import videoItemSub from '@/pages/common/video-item-sub.vue';
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		components: {
			uniLoadMore,
			uniIcons,
			modalKtvip,
			modalPay,
			modalCache,
			gameList,
			videoItemSub
		},
		computed: {
			...mapState({
				userInfo: state => state.userInfo,
			})
		},
		data() {
			return {
				chargeVipMoney: 0,
				enablePlayGesture: true, // 是否双击暂停/播放
				videoLoadingResult: 0, // 视频是否加载状态 -1 获取视频信息失败 -2 获取视频播放地址失败 -3 视频播放失败 1 获取成功
				videoControls: false, // 播放器菜单
				isVideoLoading: false, // 视频加载中
				videoInfo: {},
				platformIOS: deviceInfo.platform === 'ios',
				winHeight: deviceInfo.windowHeight,
				winWidth: deviceInfo.windowWidth,
				statusBarHeight: deviceInfo.statusBarHeight,
				safeAreaHeight: deviceInfo.windowHeight - deviceInfo.safeArea.bottom,
				controlsState: false, // 播放器菜单显示状态
				isShowVideoControls: false, // 播放器自定义菜单显示状态
				showVideoControlsMenu: '', // 显示菜单内容 空表示显示主菜单 rate-表示设置倍速 clarity-表示设置分辨率
				showVideoControlsTime: 8, // 播放器自定义菜单显示时间s
				videoRate: 1, // 当前播放倍速
				videoRateList: [0.5, 1, 1.5, 2], // 当前播放倍速
				videoClarity: '高清', // 当前分辨率 480-标清 1080-高清 20000-超清
				videoClarityList: ['20000', '1080', '480'], // 分辨率 480-标清 1080-高清 20000-超清
				setSeekTime: 0, // 指定视频初始播放位置
				isSwitchClarityLoading: false, // 是否正在切换分辨率
				tabIndex: 0, // 显示视频或者评论
				keyboardheight: 0,
				isVideo: false,
				fullScreen: false,
				leftoverPlayNumber: -1, // 剩余播放次数
				videoId: "", // 视频id
				videoSrc: "", // 视频地址
				videoPlaySrc: "", // 视频播放地址
				videoName: "", // 视频名称
				playNum: 0, // 播放量
				videoTime: "", // 日期
				lables: [], // 视频标签
				praiseNum: 0, // 点赞量
				praiseStatus: 2, // 是否已经点赞，1是，2否
				commentNum: 0, // 评论量
				isCharge: 1, // 1免费，2收费 3vip
				chargeMoney: 0, // 视频价格
				userIsCharge: false, // 是否购买过
				userWatchAuthority: 1, // 播放权限 1:试看影片 2:观看完整影片
				videoTryTime: 0, // 试看时间
				playAdvert: null, // 视频开头广告
				stopAdvert: null, // 视频暂停广告
				advertTime: 5, // 广告时间
				showVideoDefault: false, // 初始显示
				showVideoAdvert: true, // 是否显示广告
				playVideoAdvert: false, // 是否播放视频广告
				advertBg: "../../static/advertBg.jpg",
				videoPlayState: 0, // 视频播放状态 0-初始 1-暂停 2-播放完 3-试看完成
				advertBanner: null, // banner广告
				isVip: 2, // 是否是vip 1-是 2-普通用户 默认不是
				duration: 0,
				// 相关推荐
				recommendList: [],
				// 评论
				commentList: [],
				commentPage: 1,
				commentIsLoaded: false,
				commentLoadMoreStatus: 'more',
				commentContent: '',
				commentInputValue: '',
				commentInputIsFocus: false,
				comment_config: {},
				paySumTimeLength: 0, // 记录播放总时长
				pay0riginal:0,//购买原价
				payDiscount:0,//vip购买价格
				modalCacheType: 0, // 缓存弹框状态
				betList: [],
			}
		},
		onShow: function() {
			// this.isVideo = true;

			// 开始未完成的初始播放广告倒计时
			if (this.advertTime > 0 && this.showVideoAdvert && this.playAdvert) {
				this.countDown();
			}
			
			if (this.playVideoAdvert && this.videoAdvert) {
				this.videoAdvert.play();
			}
			
			for (let i = 0; i < 10; i++) {
				this.betList.push({
					list: [
						{ name: this.betName(), gameName: this.betGameName(), winNum: this.betWinNum()},
						{ name: this.betName(), gameName: this.betGameName(), winNum: this.betWinNum()},
						{ name: this.betName(), gameName: this.betGameName(), winNum: this.betWinNum()},
						{ name: this.betName(), gameName: this.betGameName(), winNum: this.betWinNum()},
					]
			  })
			}
		},
		onHide: function() {
			// 当游戏列表显示是-播放页面不做暂停操作
			if (getApp().globalData.isShowGame) return;
			
			if (this.playVideoAdvert && this.videoAdvert) {
				this.videoAdvert.pause();
			}
			// this.isVideo = false;
			if (this.videoContext) {
				this.videoContext.pause();
			}
			// 记录播放时间
			this.saveVideoPlayTime();

			if (this.countDownTime) {
				clearInterval(this.countDownTime);
			}
			this.isShowVideoControls = false;
		},
		onUnload: function() {
			if (this.playVideoAdvert && this.videoAdvert) {
				this.videoAdvert.pause();
			}
			if (this.videoContext) {
				this.videoContext.pause();
			}
			// 卸载 - 记录播放时间
			this.saveVideoPlayTime();
			// 记录真实播放时间
			this.saveVideoWatchat();

			if (this.countDownTime) {
				clearInterval(this.countDownTime);
			}
			if (this.showVideoControlsCountdownFun) {
				clearInterval(this.showVideoControlsCountdownFun);
			}
			this.isShowVideoControls = false;
			if (this.paySumTime) {
				clearInterval(this.paySumTime);
			}
			
			// 卸载监听页面重新加载事件
			uni.$off('pageReload');
			// 卸载键盘高度监听
			if (deviceInfo.platform === 'android') {
				uni.offKeyboardHeightChange();
			}
		},
		onLoad: function(option) {
			// 检查是否注册账号
			// if (!this.$store.state.userInfo.user_login) {
			// 	uni.showModal({
			// 		title: '未登录账号',
			// 		content: '使用此功能，需先登录账号',
			// 		confirmText: '登录/注册',
			// 		cancelText: '先逛逛',
			// 		success: (res) => {
			// 			if (res.confirm) {
			// 				uni.redirectTo({
			// 					url: '/pages/user/login/index'
			// 				});
			// 			} else if (res.cancel) {
			// 				uni.switchTab({
			// 				   url: '/pages/home/index'
			// 				});
			// 			}
			// 		}
			// 	});
			// 	return;
			// }
			// // 检查是否绑定手机
			// if (!this.$store.state.userInfo.mobile) {
			// 	uni.showModal({
			// 		title: '温馨提示',
			// 		content: '绑定手机号，解锁更多功能',
			// 		confirmText: '去绑定',
			// 		cancelText: '先逛逛',
			// 		success: (res) => {
			// 			if (res.confirm) {
			// 				uni.redirectTo({
			// 					url: '/pages/user/bindPhone/bindPhone?relaunch=1'
			// 				});
			// 			} else if (res.cancel) {
			// 				uni.switchTab({
			// 				   url: '/pages/home/index'
			// 				});
			// 			}
			// 		}
			// 	});
			// 	return;
			// }
			
			uni.onNetworkStatusChange((res) => {
				console.log('网络情况==>', res.isConnected, res.networkType);
				if (res.isConnected) {
					// 
				} else {
					// 提示用户网络断开
				}
				// 网络切换
				if (this.networkType && this.networkType !== res.networkType) {
					this.reloadVideoInfo();
				}
				this.networkType = res.networkType;
			});
			
			this.videoId = option.id;
			this.requestVideoInfo();
			this.getRecommendList();
			this.getCommentList();
			
			
			// 监听键盘高度 - 用于解决安卓
			if (deviceInfo.platform === 'android') {
				uni.onKeyboardHeightChange(res => {
				  console.log("onKeyboardHeightChange==>", res.height)
					if (res.height === 0) {
						this.$refs.commentInput.blur();
					}
					this.keyboardheight = res.height > 0 ? res.height-this.safeAreaHeight : 0;
				})
			}
			
			// 监听页面重新加载事件
			uni.$on('pageReload', (data) => {
				this.requestVideoInfo();
				this.getRecommendList();
				this.getCommentList();
			});
		},
		onReady: function(res) {
			// this.videoContext = uni.createVideoContext('videoContext');
		},
		methods: {
			handlePlayAdvert() {
				if (!this.countDownTime) {
					this.countDown();
				}
			},
			isExternalLink(url) {
				return config.util.isExternalLink(url);
			},
			// 视频广告播放结束
			handleVideoAdvertEnded() {
				this.showVideoAdvert = false;
				this.playVideoAdvert = false;
				// 判断是否是会员
				if (this.userInfo.is_vip === 1) { // 会员用户自动播放
					this.onClickPlay();
				} else { // 普通用户显示播放操作页面
					this.showVideoDefault = true;
					this.isVideoLoading = false;
				}
			},
			// 当没有图片返回默认图片 url 资源路径
			getImageUrl(url = '') {
				if (url.indexOf('.html') >= 0) return config.util.ImgDefault;
				return url || config.util.ImgDefault;
			},
			/**
			 * 获取图片资源-解决异步问题
			 * @param {Object} imgData 图片数据源对象
			 * @param {String} key 图片数据源对应key
			 */
			requestImageUrl(imgData = {}, key = 'image') {
				if (imgData && imgData[key] && imgData[key].indexOf('.html') >= 0) {
					// 获取图片地址
					config.util.getImage(imgData[key]).then(data => {
						imgData[key] = data;
					});
				}
			},
			// 再次获取视频信息
			reloadVideoInfo() {
				if (this.videoLoadingResult === -1) {
					this.isVideoLoading = true;
					this.videoLoadingResult = 0;
					this.requestVideoInfo();
				} else if (this.videoLoadingResult === -2) {
					this.isVideoLoading = true;
					this.videoLoadingResult = 0;
					this.onClickPlay();
				} else if (this.videoLoadingResult === -3) {
					this.isVideoLoading = true;
					this.videoLoadingResult = 0;
					setTimeout(() => {
						this.videoContext && this.videoContext.play();
						this.isVideoLoading = false;
					}, 500);
				} 
			},
			closeAdvert() {
				this.isVideoLoading = false;
				this.videoPlayState = 0;
			},
			async downloadTip() {
				// 屏蔽掉下载
				uni.showToast({
					icon: 'none',
					title: '敬请期待'
				});
				return;
			},
			// 确认请求支付
			confirmPay() {
				if (this.payLoading) return;
				this.payLoading = true;
				// 确定购买
				http.post({
					url: config.api.payVideo,
					data: {
						video_id: this.videoId
					},
					isLoading: true
				}).then((res) => {
					this.$refs.modalPay.close();
					this.payLoading = false;
					uni.showToast({
						icon: 'none',
						title: '购买成功'
					});
					this.isVideo = false;
					this.userIsCharge = true; // 已付过费
					this.setSeekTime = this.videoPlayTime;
					this.advertTime = 1;
					this.$nextTick(() => {
						this.isVideo = true;
						// this.videoContext = uni.createVideoContext('videoContext');
						this.onClickPlay();
					});

					// 获取个人信息
					this.$store.dispatch('getUserInfo');
				}).catch((err) => {
					this.$refs.modalPay.close();
					this.payLoading = false;
				})
			},
			// 激活支付弹框
			toPayTip() {
				if (this.userIsCharge) {
					uni.showToast({
						icon: 'none',
						title: '已支付'
					});
					return;
				}
				this.videoContext && this.videoContext.fullScreen.cancel('web');
				// this.$refs.modalPay.open();
				
				uni.showLoading({
					title: '请稍后...',
					mask: true
				});
				this.$store.dispatch('getUserInfo').then(() => {
					uni.hideLoading();
					this.$refs.modalPay.open();
				})
				.catch((err) => {
					uni.hideLoading();
					this.$refs.modalPay.open();
				})
			},
			dateTimeStamp(date) {
				const dateTime = new Date(date).getTime();
				return config.util.dateTimeStamp(dateTime);
			},
			dateTimeFun(date) {
				return date.split(' ')[0];
				// return (new Date(date)).Format("yyyy-MM-dd");
			},
			showVipTip(isShow) {
				this.videoContext && this.videoContext.fullScreen.cancel('web');
				if (isShow) {
					this.$store.dispatch('getUserInfo').then(() => {
						this.$refs.modalKtvip.open();
					})
					.catch((err) => {
						this.$refs.modalKtvip.open();
					})
				} else {
					this.$refs.commentInput.focus();
				}
			},
			numberCount(value) {
				return config.util.unitToW(value);
			},
			moneyUnit(value) {
				return config.util.moneyUnit(value);
			},
			toHome() {
				if (this.videoContext) this.videoContext.fullScreen.cancel('web');
				uni.navigateBack();
			},
			toPayVip(id = 0) {
				this.videoContext && this.videoContext.pause();
				this.videoContext && this.videoContext.fullScreen.cancel('web');
				// 开通vip
				if (this.fullScreen) {
					setTimeout(() => {
						uni.navigateTo({
							url: "/pages/user/voucherCenter/voucherCenter?id="+id
						})
					}, 300);
				} else {
					uni.navigateTo({
						url: "/pages/user/voucherCenter/voucherCenter?id="+id
					})
				}
				this.$refs.modalCache.close();
				this.$refs.modalKtvip.close();
				this.$refs.modalPay.close();
				this.$refs.modalKtvipClarity.close();
			},
			toPlay(id) {
				this.videoContext && this.videoContext.pause();
				this.videoContext && this.videoContext.fullScreen.cancel('web');
				uni.redirectTo({
					url: "/pages/play/play?id=" + id
				})
			},
			toSharePage() {
				this.videoContext && this.videoContext.pause();
				// 分享推广
				uni.navigateTo({
					url: "/pages/user/promotionPage/promotionPage"
				})
			},
			// 试看开通vip
			toPayVipClick(e) {
				e.stopPropagation();
				
				this.toPayVip();
			},
			// 试看购买
			toPayVipTipClick(e) {
				e.stopPropagation();
				
				this.toPayTip();
			},
			// 视频结束跳转广告
			goAdvertPageClick(e) {
				e.stopPropagation();
				
				if (this.fullScreen && this.videoInfo.recommend_video_end_fs_advert) {
					this.goAdvertPage(this.videoInfo.recommend_video_end_fs_advert.url, this.videoInfo.recommend_video_end_fs_advert.id);
				}
				if (!this.fullScreen && this.videoInfo.recommend_video_end_not_fs_advert) {
					this.goAdvertPage(this.videoInfo.recommend_video_end_not_fs_advert.url, this.videoInfo.recommend_video_end_not_fs_advert.id);
				}
			},
			// 重新播放
			onClickReplay(e) {
				e.stopPropagation();
				
				// this.videoContext.play();
				if (this.userWatchAuthority === 2) {
					// this.videoContext.stop();
					setTimeout(() => {
						this.videoContext && this.videoContext.play();
					}, 500);
				} else {
					this.videoContext && this.videoContext.play();
				}
			},
			// 请求播放视频信息
			requestVideoInfo() {
				http.post({
					url: config.api.getVideoInfo,
					data: {
						id: this.videoId
					},
					isLoading: true
				}).then((res) => {
					this.videoLoadingResult = 1;
					this.isVideo = true;
					// this.videoContext = uni.createVideoContext('videoContext');
					
					const data = res.data;
					if (data) {
						this.videoInfo = data; // 视频详情
						this.requestImageUrl(this.videoInfo);
						
						this.leftoverPlayNumber = data.watch_num || 0; // 用户剩余播放次数
						this.isVip = data.is_vip; // 1-vip 2-不是vip
						this.videoName = data.name; // 视频名称
						this.playNum = data.play_num; // 播放量
						this.videoTime = data.created_at; // 日期
						this.lables = data.lables || []; // 视频标签
						this.praiseNum = data.praise; // 点赞量
						this.praiseStatus = data.praise_status; // 是否已经点赞，1是，2否
						this.commentNum = data.comment_num; // 评论量
						this.isCharge = data.is_charge; // 1免费，2收费 3vip 4限免 5预告片
						this.chargeMoney = data.charge || 0; // 视频价格
						this.userIsCharge = data.user_is_charge; // 是否购买过
						this.userWatchAuthority = data.user_is_try; // 用户的视频播放权限 1:试看影片 2:观看完整影片
						this.videoTryTime = data.video_try; // 试看时间
						
						this.playAdvert = data.recommend_video_play_advert; // 视频开头广告
						this.requestImageUrl(this.playAdvert);
						
						this.stopAdvert = data.recommend_video_stop_advert; // 视频暂停广告
						this.requestImageUrl(this.stopAdvert);
						
						this.advertTime = data.player_ad; // 广告时间
						
						this.advertBanner = data.ad_banner; // banner广告
						this.requestImageUrl(this.advertBanner);
						
						this.videoAllTime = config.util.dateToSecond(data.time_length); // 视频完整时常

						this.chargeVipMoney = data.vip_charge; // vip价格
						this.comment_config = data.comment_config // 评论字数限制及评论开关
						this.pay0riginal = data.paid_resources;//普通用户价格
						this.payDiscount = data.vip_paid_resources;//vip用户价格
						// 判断是否有广告
						if (this.playAdvert && this.advertTime > 0) {
							// 第一步 显示广告开始广告倒计时
							this.showVideoAdvert = true;
							
							if (this.playAdvert.type === 2) { // 视频广告
								this.playVideoAdvert = true;
								// this.videoAdvert = uni.createVideoContext('videoAdvert');
								
								setTimeout(() => {
									// 初始化视频-广告
									this.videoAdvert = new DPlayer({
										container: document.getElementById('videoAdvert'),
										video: {
											url: this.playAdvert.video_path,
										},
										autoplay: true,
										volume: 0,
										contextmenu: [],
									});
									this.videoAdvert.on('play', this.handlePlayAdvert);
									this.videoAdvert.on('ended', this.handleVideoAdvertEnded);
								}, 500)
							} else {
								this.countDown();
							}
						} else {
							this.showVideoAdvert = false;
							// 判断是否是会员
							if (this.userInfo.is_vip === 1) { // 会员用户自动播放
								this.onClickPlay();
							} else { // 普通用户显示播放操作页面
								this.showVideoDefault = true;
							}
						}
						
						// 获取视频结束广告
						this.requestImageUrl(this.videoInfo.recommend_video_end_fs_advert);
						this.requestImageUrl(this.videoInfo.recommend_video_end_not_fs_advert);
					}
				}).catch((err) => {
					console.log("err==>", err)
					this.videoLoadingResult = -1;
				})
			},
			// 点击播放视频
			onClickPlay() {
				if (this.videoContext) {
					this.videoContext.destroy();
					this.videoContext = null;
				}
				if (this.palyUrlLoading) return;
				this.palyUrlLoading = true;
				this.isVideoLoading = true;
				// 请求播放地址
				http.post({
					url: config.api.getVideoUrl,
					data: {
						id: this.videoId
					}
				}).then((res) => {
					this.palyUrlLoading = false;
					this.videoLoadingResult = 1;
					if (res.data) {
						this.videoSrc = res.data.url; // 视频资源地址
						this.videoPlaySrc = (this.videoClarityNumber&&res.data.url[this.videoClarityNumber]) || res.data.url['1080'] || res.data.url['480'] || ''; // 播放地址
						this.userWatchAuthority = res.data.user_is_try; // 观看权限 1-试看影片 2-观看完整影片
						this.res_is_try = res.data.res_is_try; // 试看资源是否完整影片 1-切的试看资源 2-完整影片资源
						this.showVideoDefault = false;
						this.showVideoAdvert = false;
						this.playVideoAdvert = false;
						if (this.userWatchAuthority === 1) {
							// this.duration = this.videoTryTime;
							this.duration = res.data.res_is_try === 1 ? 0 : this.videoTryTime; 
						} else {
							// this.duration = this.videoAllTime;
							this.duration = 0;
						}
						
						// 初始化视频
						this.videoContext = new DPlayer({
							container: document.getElementById('videoContext'),
							video: {
								url: this.videoPlaySrc,
							},
							contextmenu: [],
						});
						this.videoContext.on('play', this.handleVideoPlay);
						this.videoContext.on('pause', this.handleVideoPause);
						this.videoContext.on('ended', this.handleVideoEnded);
						this.videoContext.on('error', this.handleVideoError);

						// 播放视频
						this.$nextTick(() => {
							setTimeout(() => {
								this.videoContext.play();
								this.advertTime = 0;
							}, 300)
						})
					}
				}).catch((err) => {
					this.palyUrlLoading = false;
					this.videoLoadingResult = -2;
				})
			},
			// 点击tab
			onClickTab(index) {
				this.switchTab(index);
			},
			// TabPage切换
			onChangeTabPage(e) {
				let index = e.target.current || e.detail.current;
				this.switchTab(index);
			},
			/**
			 * tab切换
			 * @param {number} index - Key to be escaped.
			 */
			switchTab(index) {
				index = parseInt(index)
				if (this.tabIndex === index) {
					return;
				}
				this.tabIndex = index;
				// 选中游戏item
				if (this.tabIndex == 2) {
					// 跳转游戏
					// #ifdef APP-PLUS
					getApp().globalData.isShowGame = true;
					uni.navigateTo({
						url: '/pages/game/venue',
						animationType: 'slide-in-bottom'
					})
					// #endif
					
					// #ifdef H5
					// uni.switchTab({
					// 	url: '/pages/game/index',
					// })
					uni.navigateTo({
						url: "/pages/home/index"
					})
					// #endif
				}				
			},
			// 倒计时
			countDown() {
				this.countDownTime = setInterval(() => {
					this.advertTime--
					if (this.advertTime <= 0) {
						this.advertTime = 0;
						// 广告倒计时结束 隐藏广告
						clearInterval(this.countDownTime);
						// 当播放视频广告
						if (this.playVideoAdvert) {
							return;
						}
						
						this.showVideoAdvert = false;
						// 判断是否是会员
						if (this.userInfo.is_vip === 1) { // 会员用户自动播放
							this.onClickPlay();
						} else { // 普通用户显示播放操作页面
							this.showVideoDefault = true;
							this.isVideoLoading = false;
						}
					}
				}, 1000);
			},
			// 去视频贴面的广告网站
			goAdvertPage(url, id) {
				this.videoContext.pause();
				this.videoContext.fullScreen.cancel('web');
				http.post({
					url: config.api.clickVolume,
					data: {
						advert_id: id
					}
				})
				
				if (this.fullScreen) {
					setTimeout(() => {
						config.util.openURL(url);
					}, 300);
				} else {
					config.util.openURL(url);
				}
			},
			// 记录真实播放时间
			paySumTimeFun() {
				this.paySumTime = setInterval(() => {
					this.paySumTimeLength++
				}, 1000);
			},
			// 播放错误时触发
			handleVideoError(e) {
				this.videoLoadingResult === -3; // 播放失败
				
				// 播放错误-上报服务器
				if (this.videoPlaySrc && !this.videoPlayTime) {
					http.post({
						url: config.api.videoPlayError,
						data: {
							video_id: this.videoId
						}
					}).then((res) => {
						// uni.showToast({
						// 	icon: 'none',
						// 	title: '视频播放失败',
						// 	duration: 2000
						// });
					}).catch((err) => {})
				}
			},
			handleWaiting(e) {
				if(this.videoPlaySrc) {
					this.isVideoLoading = true;
					this.videoWaiting = true;
				}
				console.log("=handleWaiting===>", e)
			},
			handleProgress(e) {
				// console.log("=handleProgress===>", e)
			},
			handleLoadedmetadata(e) {
				console.log("=handleLoadedmetadata===>", e)
			},
			// 暂停播放
			handleVideoPause(e) {
				if (this.advertTime === 0 && this.videoPlayState === 0) {
					this.videoPlayState = 1;
				}
				if (this.paySumTime) {
					clearInterval(this.paySumTime);
				}
			},
			// 播放
			handleVideoPlay(e) {
				this.videoPlayState = 0;
				this.paySumTimeFun();
			},
			// 播放到末尾
			handleVideoEnded(e) {
				this.videoPlayState = 2;
				this.videoPlayTime = 0; // 清除播放时间
				this.isVideoLoading = false;
				
				// 当播放完整视频时-播放完过后自动重复播放
				// if (this.userWatchAuthority === 2) {
				// 	this.videoContext.stop();
				// 	setTimeout(() => {
				// 		this.videoContext.play();
				// 	}, 500);
				// }
				
				// 试看资源试看结束
				if(this.userWatchAuthority === 1 && this.res_is_try === 1)  {
					this.videoPlayState = 3; // 试看完成
					// this.videoContext.stop(); // 停止
				}
			},
			// 播放进度变化
			handleVideoTimeupdate(e) {
				// 判断当视频是暂停状态下不播放
				if (this.videoPlayState === 1) {
					this.videoContext.pause();
				}
				
				this.videoControls = true;
				
				const {
					currentTime,
					duration
				} = e.detail;
				
				const currentDateGetTime = new Date().getTime();
				if (this.videoWaiting) {
					// 当视频是缓冲 - 不去改变视频加载中
					this.videoWaiting = false;
				} else if (parseInt(currentTime) === this.videoPlayTime) {
					// 当视频播放进度在1秒内未改变 提示视频加载中
					if (this.currentDateGetTime && (currentDateGetTime - this.currentDateGetTime > 1000)) {
						this.isVideoLoading = true;
					}
				} else if (parseInt(currentTime) - this.videoPlayTime > 10) {
					// 当视频播放进度是被拖动的 提示视频加载中
					this.isVideoLoading = true;
				} else {
					// 视频播放中-不显示加载中
					this.isVideoLoading = false;
					// 视频播放进度不相等记录当前的时间
					if (parseInt(currentTime) !== this.videoPlayTime) {
						this.currentDateGetTime = currentDateGetTime;
					}
				}
				
				// 判断当视频被拖到最后需要隐藏加载效果
				if (parseInt(currentTime) === parseInt(duration)) {
					setTimeout(() => {
						this.isVideoLoading = false;
					}, 500);
					
					// 当播放完整视频时-播放完过后自动重复播放
					// if (this.userWatchAuthority === 2) {
					// 	setTimeout(() => {
					// 		this.videoContext.play();
					// 	}, 800);
					// }
					if (this.userWatchAuthority === 2 && parseInt(duration) > 0) {
						const deviceInfoNew = uni.getSystemInfoSync();
						if (this.fullScreen) {
							this.winWidth++;
							this.winHeight++;
						}
						this.videoPlayState = 2;
						this.videoPlayTime = 0; // 清除播放时间
						this.isVideoLoading = false;
						// this.videoContext.stop(); // 停止
					}
				}
				
				this.videoPlayTime = parseInt(currentTime); // 记录播放秒数
				// 判断是否是试看视频 
				if ((this.videoPlayTime >= this.duration && this.duration > 0) || (this.userWatchAuthority === 1 && this.res_is_try === 1 && parseInt(duration) > 0 && parseInt(currentTime) === parseInt(duration))) {
					// 解决安卓播放结束遮罩偏方
					const deviceInfoNew = uni.getSystemInfoSync();
					if (this.fullScreen && deviceInfoNew.platform==='android') {
						this.winWidth++;
						this.winHeight++;
					}
					
					this.videoPlayState = 3; // 试看完成
					// this.videoContext.stop(); // 停止
				}
			},
			// 全屏时触发
			fullscreenchange(e) {
				const {
					fullScreen,
					direction
				} = e.detail;
				const deviceInfoNew = uni.getSystemInfoSync();
				// 退出横屏
				if (!fullScreen) {
					if (deviceInfoNew.platform==='android') {
						this.winWidth = deviceInfoNew.windowWidth;
						this.winHeight = deviceInfoNew.windowHeight;
					}
					plus.screen.lockOrientation("portrait-primary");
				} else {
					if (deviceInfoNew.platform==='android') {
						this.winWidth = deviceInfoNew.windowHeight + 10;
						this.winHeight = deviceInfoNew.windowWidth + 50; // 解决安卓有虚拟按键导航导致获取宽度不够问题
					}
				}
				
				this.$nextTick(() => {
					this.fullScreen = fullScreen;
				})
			},
			// 视频播放全屏播放时点击事件
			fullscreenclick(e) {
				const {
					screenX,
					screenY
				} = e.detail;
				// ios 全屏返回按钮
				if (screenY <= 40 && screenX < 100 && this.platformIOS) {
					this.videoContext.fullScreen.cancel('web');
				}
			},
			// 切换 controls 显示隐藏时触发
			controlstoggle(e) {
				this.controlsState = e.detail.show;
				if (e.detail.show) {
					this.isShowVideoControls = true;

					// 倒计时隐藏自定义菜单
					if (this.showVideoControlsCountdownFun) {
						clearInterval(this.showVideoControlsCountdownFun);
					}
					this.showVideoControlsCountdown();
				}
			},
			// 播放器菜单显示倒计时
			showVideoControlsCountdown() {
				this.showVideoControlsCountdownFun = setInterval(() => {
					this.showVideoControlsTime--;
					if (this.showVideoControlsTime === 0) {
						clearInterval(this.showVideoControlsCountdownFun);
						this.showVideoControlsTime = 8;
						this.isShowVideoControls = false;
						this.showVideoControlsMenu = '';
					}
				}, 1000);
			},
			// 打开对应的功能菜单
			showVideoControlsMenuFun(meun, e) {
				if (e) e.stopPropagation();
				this.showVideoControlsTime = 8;
				this.showVideoControlsMenu = meun;
			},
			// 设置播放倍速
			playbackRate(rate, e) {
				if (e) e.stopPropagation();
				this.showVideoControlsTime = 8;
				this.videoRate = rate;
				// 倒计时隐藏自定义菜单
				if (this.showVideoControlsCountdownFun) {
					clearInterval(this.showVideoControlsCountdownFun);
				}
				this.isShowVideoControls = false;
				this.showVideoControlsMenu = '';
			},
			// 设置播放分辨率
			setVideoClarity(clarity, e) {
				if (e) e.stopPropagation();
				this.showVideoControlsTime = 8;
				// 倒计时隐藏自定义菜单
				if (this.showVideoControlsCountdownFun) {
					clearInterval(this.showVideoControlsCountdownFun);
				}
				this.isShowVideoControls = false;
				this.showVideoControlsMenu = '';

				let clarityStr = ''
				switch (clarity) {
					case '标清':
						clarityStr = '480';
						break;
					case '高清':
						clarityStr = '1080';
						break;
					case '超清':
						// 超清为vip专享
						if (this.userInfo.is_vip === 2) {
							this.videoContext.fullScreen.cancel('web');
							this.$store.dispatch('getUserInfo').then(() => {
								this.$refs.modalKtvipClarity.open();
							})
							.catch((err) => {
								this.$refs.modalKtvipClarity.open();
							})
							return;
						}
						clarityStr = '20000';
						break;
					default:
						break;
				}
				this.videoClarity = clarity;
				this.videoClarityNumber = clarityStr;
				this.isSwitchClarityLoading = true;
				this.videoPlaySrc = this.videoSrc[clarityStr];
				this.setSeekTime = this.videoPlayTime;
				this.advertTime = 1;
				this.$nextTick(() => {
					setTimeout(() => {
						this.videoContext.play();
						this.isSwitchClarityLoading = false;
						this.advertTime = 0;
					}, 500)
				})
			},

			// 监听播放点击事件
			handleVideoClick() {
				if(this.isVideoLoading) {
					return;
				}
				
				// ios 模拟假双击 - 用于双击播放暂停切换
				if (deviceInfo.platform === 'ios') {
					const currentTime = new Date().getTime();
					// 双击
					if (this.clickNumber && currentTime - this.clickNumber <= 250) {
						console.log("handleVideoClick===双击=>")
						if (this.videoPlayState === 0) {
							this.videoContext.pause();
						} else if (this.videoPlayState === 1) {
							this.videoContext.play();
						}
					}
					this.clickNumber = currentTime;
				}

				// 隐藏自定义菜单
				if (this.isShowVideoControls) {
					if (this.showVideoControlsCountdownFun) {
						clearInterval(this.showVideoControlsCountdownFun);
					}
					this.showVideoControlsTime = 8;
					this.isShowVideoControls = false;
					this.showVideoControlsMenu = '';
				}
			},
			// 点赞
			optLike() {
				if (this.likeLoading) return;
				this.likeLoading = true;
				http.post({
					url: config.api.videoLike,
					data: {
						video_id: this.videoId
					}
				}).then((res) => {
					this.likeLoading = false;
					this.praiseStatus = 1;
					this.praiseNum++;
				}).catch((err) => {
					this.likeLoading = false;
				})
			},
			// 取消点赞
			optCancelLike() {
				if (this.likeCancelLoading) return;
				this.likeCancelLoading = true;
				http.post({
					url: config.api.videoCancelLike,
					data: {
						video_ids: [this.videoId]
					}
				}).then((res) => {
					this.likeCancelLoading = false;
					this.praiseStatus = 2;
					this.praiseNum--;
				}).catch((err) => {
					this.likeCancelLoading = false;
				})
			},


			// 记录视频播放到的时间
			saveVideoWatchat() {
				if (this.videoPlayTime > 0) {
					http.post({
						url: config.api.saveVideoWatchat,
						data: {
							video_id: this.videoId,
							watch_at: this.videoPlayTime
						}
					}).then((res) => {}).catch((err) => {})
				}
			},
			// 记录视频真实播放总时间
			saveVideoPlayTime() {
				if (this.paySumTimeLength > 0) {
					http.post({
						url: config.api.saveVideoPlayTime,
						data: {
							video_id: this.videoId,
							watch_time: this.paySumTimeLength
						}
					}).then((res) => {}).catch((err) => {})
				}
			},
			// 获取相关推荐
			getRecommendList() {
				http.post({
					url: config.api.getVideoRecommend,
					data: {
						id: this.videoId
					}
				}).then((res) => {
					if (res.data) {
						this.recommendList = res.data;
						// 获取真实图片
						setTimeout(() => {
							res.data.forEach(item => {
								this.requestImageUrl(item);
							})
						}, 200)
					}
				}).catch((err) => {})
			},
			// 监听键盘高度发生变化
			keyboardheightchange(e) {
				const {
					height
				} = e.detail;
				if (deviceInfo.platform !== 'android') {
					this.keyboardheight = height < 100 ? 0 : height-this.safeAreaHeight;
					if (this.keyboardheight === 0) {
						this.$refs.commentInput.blur();
					}
				}
				console.log("keyboardheightchange==>", height)
			},
			handleFocus(e) {
				this.commentInputIsFocus = true;
				const {
					height,
					value
				} = e.detail;
				if (deviceInfo.platform !== 'android') {
					this.keyboardheight = height < 100 ? 0 : height-this.safeAreaHeight;
				}
				console.log("handleFocus==>", height, value)
				this.tabIndex = 1;
			},

			showInputToast() {
				if (this.comment_config.status == 2) {
					// uni.hideKeyboard();
					// this.keyboardheight = 0
					uni.showToast({
						icon: 'none',
						title: '评论功能已关闭'
					});
					return false;
				}
			},

			handleBlur(e) {
				this.commentInputIsFocus = false;
				const {
					value
				} = e.detail;
				this.keyboardheight = 0;
				console.log("handleBlur==>", value)

				uni.hideKeyboard();
			},
			handleInputChange(e) {
				this.commentInputValue = e.detail.value;
				if (this.commentInputValue.length >= this.comment_config.word_count) {
					uni.showToast({
						icon: 'none',
						title: '评论字数超过限制'
					});
				}
			},
			handleConfirm(e) {
				uni.hideKeyboard();
			},
			// 获取评论
			getCommentList() {
				http.post({
					url: config.api.getCommentList,
					data: {
						video_id: this.videoId,
						current_page: this.commentPage
					}
				}).then((res) => {
					this.commentIsLoaded = true;

					if (res.data) {
						const data = res.data;
						this.commentList = this.commentPage === 1 ? data.list : this.commentList.concat(data.list || []);
						this.commentPage++;
						this.commentLoadMoreStatus = data.per_page > data.list.length ? "noMore" : "more"; // 是否有更多
						this.commentNum = this.commentList.length;
						
						// 获取真实图片
						res.data.forEach(item => {
							this.requestImageUrl(item);
						})
					}
				}).catch((err) => {
					this.commentIsLoaded = true;
				})
			},
			// 加载更多
			loadMore(e) {
				if (this.commentLoadMoreStatus === "noMore") {
					return;
				}
				this.commentLoadMoreStatus = "loading";
				this.getCommentList();
			},
			// 发送评论
			sendComment() {
				if (this.commentInputValue && this.userInfo.is_vip === 1) {
					if (this.commentLoading) return;
					this.commentLoading = true;
					http.post({
						url: config.api.addComment,
						data: {
							video_id: this.videoId,
							comment: this.commentInputValue
						},
						isLoading: true
					}).then((res) => {
						this.commentLoading = false;
						uni.showToast({
							icon: 'none',
							title: '评论成功'
						});
						this.commentInputValue = "";
						uni.hideKeyboard();
						this.commentLoadMoreStatus = "more";
						this.commentPage = 1;
						this.getCommentList();
					}).catch((err) => {
						this.commentLoading = false;
					})
				}
			},
			betName() {
				let numValue = '1234567890';
		        let nameNum = '';		
		        for (let i = 0; i < 4; i++) {
		            nameNum += numValue.charAt(Math.floor(Math.random() * numValue.length));
		        };
				let nameStr = uni.getStorageSync('userInfo').name+nameNum;
				return nameStr.substring(0,3);
				// return uni.getStorageSync('userInfo').name+nameNum;
			},
			betWinNum() {
				let numValue = '1234567890';
		        let winNum = '';		
		        for (let i = 0; i < 4; i++) {
		            winNum += numValue.charAt(Math.floor(Math.random() * numValue.length));
		        };
				return Number(winNum);
			},
			betGameName() {
				let gameTmpList = ["真人百家乐", "龙虎争霸", "万人牛牛", "抢庄牛牛", "红包游戏", "极速赛车", 
							       "极速飞艇", "幸运分分彩", "六合5分彩", "极速11选5","英皇捕鱼", "十二生肖",
							       "牛气冲天", "鱼跃龙门", "赤壁之战", "大闹天宫","财神到"];
			    let index = Math.floor(Math.random() * 17);
			    let gameName = gameTmpList[index]
				return gameName;
			},
			followBet() {
				this.switchTab(2);
			}
		}
	}
</script>

<style scoped>
	.flex-row {
		flex-direction: row;
		/* #ifndef APP-PLUS */
		display: flex;
		/* #endif */
	}

	.play-page {
		width: 750rpx;
		/* #ifndef APP-PLUS */
		display: flex;
		flex-direction: column;
		/* #endif */
	}

	.status-bar {
		background-color: #000000;
	}

	.play-vedio {
		width: 750rpx;
		height: 421rpx;
	}

	.video-back {
		position: absolute;
		top: 0;
		z-index: 999;
	}

	.video-back-img {
		width: 21rpx;
		height: 42rpx;
		margin-top: 10rpx;
		margin-left: 30rpx;
		margin-right: 30rpx;
		margin-bottom: 10rpx;
	}

	.video-title-show {
		transform: translateY(80rpx);
	}

	.video-title-hide {
		transform: translateY(0rpx);
	}

	.video-title {
		position: absolute;
		left: 0;
		top: -80rpx;
		z-index: 999;
		height: 80rpx;
		background-color: rgba(0, 0, 0, .3);
		align-items: center;
		justify-content: flex-start;
		flex-direction: row;
		flex-wrap: nowrap;
		transition-property: transform;
		transition-duration: 0.3s;
		transition-timing-function: ease-in-out;
		/* #ifndef APP-PLUS */
		display: flex;
		/* #endif */
	}

	.video-title-text {
		color: #FFFFFF;
		font-size: 28rpx;
		flex: 1;
		lines: 1;
		text-overflow: ellipsis;
	}

	.video-cover {
		flex-wrap: wrap;
		width: 750rpx;
		height: 421rpx;
		position: absolute;
		top: 0;
		left: 0;
		justify-content: center;
		align-items: center;
		background-color: rgba(0, 0, 0, .7);
		/* #ifndef APP-PLUS */
		display: flex;
		z-index: 1;
		/* #endif */
	}

	.video-play {
		width: 120rpx;
		height: 120rpx;
		margin-bottom: 10rpx;
	}

	.video-play-text {
		color: #FFFFFF;
		font-size: 28rpx;
	}

	.video-play-number {
		color: #ff7f00;
		font-size: 28rpx;
	}

	.video-pay-btn {
		/* position: absolute;
		right: 10rpx;
		top: 10rpx; */
		font-weight: 500;
		color: #FFFFFF;
		font-size: 24rpx;
		border-radius: 50rpx;
		padding: 0 30rpx;
		height: 54rpx;
		line-height: 54rpx;
		background-image: linear-gradient(to right, #ffc400, #ff7f00);
	}

	.video-controls-show {
		transform: translateX(0rpx);
	}

	.video-controls-hide {
		transform: translateX(160rpx);
	}

	.video-controls {
		position: absolute;
		top: 0;
		right: 10rpx;
		width: 120rpx;
		height: 330rpx;
		align-items: center;
		justify-content: flex-end;
		transition-property: transform;
		transition-duration: 0.3s;
		transition-timing-function: ease-in-out;
		/* #ifndef APP-PLUS */
		display: flex;
		/* #endif */
	}

	.video-controls-menu {
		background-color: rgba(0, 0, 0, .3);
		width: 120rpx;
		height: 60rpx;
		margin: 5rpx 0;
		border-radius: 10rpx;
		align-items: center;
		justify-content: center;
		/* #ifndef APP-PLUS */
		display: flex;
		/* #endif */
	}

	.video-controls-menu-text {
		color: #ffffff;
		font-size: 28rpx;
	}

	.video-controls-menu-active {
		color: #ff7f00;
	}

	.video-advert {
		width: 750rpx;
		height: 421rpx;
		position: absolute;
		top: 0;
	}

	.video-advert-img {
		width: 750rpx;
		height: 421rpx;
	}

	.count-down {
		width: 100rpx;
		height: 60rpx;
		background-color: #808080;
		border-radius: 40%;
		position: absolute;
		right: 10rpx;
		top: 10rpx;
		/* #ifndef APP-PLUS */
		display: flex;
		justify-content: center;
		/* #endif */
	}

	.count-down-text {
		font-size: 30rpx;
		color: #FFFFFF;
		text-align: center;
		line-height: 60rpx;
	}

	.close-advert {
		width: 60rpx;
		height: 60rpx;
	}

	.video-advert-stop {
		justify-content: center;
		align-items: center;
		left: 375rpx;
		top: 210rpx;
		width: 460rpx;
		height: 280rpx;
		margin-left: -230rpx;
		margin-top: -140rpx;
	}

	.video-advert-top-img {
		width: 460rpx;
		height: 280rpx;
	}

	/* 试看结束提示 */
	.haveatry-tip-text1 {
		font-weight: 500;
		color: #ff7f00;
		font-size: 36rpx;
		text-align: center;
	}

	.haveatry-tip-text2 {
		color: #ffffff;
		font-size: 28rpx;
	}

	.haveatry-tip-btn1 {
		width: 240rpx;
		height: 76rpx;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		border-style: solid;
		border-color: #FFFFFF;
		border-width: 2rpx;
		border-radius: 76rpx;
		font-weight: 500;
		color: #ffffff;
		font-size: 32rpx;
		/* #ifndef APP-PLUS */
		display: flex;
		/* #endif */
	}

	.haveatry-tip-btn-text {
		font-weight: 500;
		color: #ffffff;
		font-size: 32rpx;
	}

	.haveatry-tip-btn2 {
		width: 240rpx;
		height: 76rpx;
		justify-content: center;
		align-items: center;
		border-style: solid;
		border-width: 2rpx;
		border-radius: 76rpx;
		border-color: #ff7f00;
		color: #ff7f00;
		/* background-image: linear-gradient(to right, #ffc400, #ff7f00); */
		/* #ifndef APP-PLUS */
		display: flex;
		/* #endif */
	}

	.tabs {
		flex: 1;
		/* #ifndef APP-PLUS */
		display: flex;
		flex-direction: column;
		/* #endif */
	}

	.tab-header {
		height: 80rpx;
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: center;
		align-items: center;
		background-color: #FFFFFF;
		box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.08);
		/* #ifndef APP-PLUS */
		display: flex;
		/* #endif */
	}

	.tab-header-item {
		flex-direction: row;
		flex-wrap: nowrap;
		align-items: flex-start;
		justify-content: center;
		padding: 0 100rpx;
		/* #ifndef APP-PLUS */
		display: flex;
		/* #endif */
	}

	.tab-header-tbox {
		height: 80rpx;
		justify-content: center;
		align-items: center;
		/* #ifndef APP-PLUS */
		display: flex;
		flex-direction: column;
		/* #endif */
	}

	.tab-header-text {
		color: #222222;
		font-size: 32rpx;
		height: 74rpx;
		line-height: 80rpx;
	}

	.tab-header-text-active {
		width: 52rpx;
		height: 6rpx;
		border-radius: 6rpx;
		background-color: #ff7f00;
	}

	.tab-header-count {
		color: #ff7f00;
		font-size: 24rpx;
		line-height: 80rpx;
	}

	.tab-view {
		flex: 1;
	}

	.scroll-view {
		flex: 1;
		/* padding: 0 30rpx; */
	}

	/* 视频板块样式 */
	.advert-img {
		width: 690rpx;
		height: 140rpx;
		margin: 20rpx 0;
	}

	.video-name {
		font-weight: 500;
		color: #222222;
		font-size: 32rpx;
		margin-top: 10rpx;
	}

	.video-info-text {
		color: #7c7c7c;
		font-size: 24rpx;
		margin-right: 20rpx;
	}

	.video-lable {
		border-radius: 8rpx;
		background-color: rgba(237, 237, 237, 0.5);
		color: #7c7c7c;
		font-size: 24rpx;
		height: 50rpx;
		line-height: 50rpx;
		padding: 0 15rpx;
		margin: 6rpx 12rpx 6rpx 0;
	}

	.video-count {
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: space-between;
		align-items: center;
		margin: 16rpx 0;
		/* #ifndef APP-PLUS */
		display: flex;
		/* #endif */
	}

	.video-count-item {
		justify-content: center;
		flex-direction: column;
		align-items: center;
		padding: 0 10rpx;
		padding-top: 32rpx;
		/* #ifndef APP-PLUS */
		display: flex;
		position: relative;
		/* #endif */
	}

	.video-count-icon {
		width: 58rpx;
		height: 58rpx;
	}

	.video-count-text {
		color: #9caac3;
		font-size: 24rpx;
		margin-top: 4rpx;
		height: 40rpx;
	}

	.redSize {
		width: 100rpx;
		height: 80rpx;
		position: absolute;
		/* background-color: rgba(255, 127, 0, .5); */
		right: -20rpx;
		top: 0;
	}

	.redSize-image {
		width: 68rpx;
		height: 30rpx;
		position: relative;
	}

	.redSize-text {
		width: 68rpx;
		height: 30rpx;
		color: #fff;
		font-weight: 600;
		font-size: 16rpx;
		line-height: 30rpx;
		padding: 1rpx 2rpx;
		text-align: center;
		position: absolute;
		top: 0;
		left: 0;
	}

	/* 相关推荐 */
	.remd {
		margin: 10rpx 0;
	}

	.remd-header {
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: space-between;
		align-items: center;
		margin: 10rpx 0;
		height: 40rpx;
		/* #ifndef APP-PLUS */
		display: flex;
		/* #endif */
	}

	.remd-header-row {
		flex-direction: row;
		flex-wrap: nowrap;
		align-items: center;
		/* #ifndef APP-PLUS */
		display: flex;
		/* #endif */
	}

	.remd-header-more {
		color: #9CAAC3;
		font-size: 28rpx;
	}

	.remd-header-title {
		font-weight: 500;
		color: #222222;
		font-size: 32rpx;
		margin-left: 8rpx;
		margin-right: 100rpx;
		lines: 1;
		text-overflow: ellipsis;
		flex: 1;
		/* #ifndef APP-NVUE */
		display: block;
		white-space: nowrap;
		overflow: hidden;
		/* #endif */
	}

	.remd-content {
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-between;
		/* #ifndef APP-PLUS */
		display: flex;
		/* #endif */
	}

	.remd-item {
		margin: 20rpx 0 10rpx 0;
		width: 330rpx;
	}

	.remd-item-box {
		position: relative;
		width: 330rpx;
		height: 185rpx;
	}

	.remd-item-img {
		position: absolute;
		width: 330rpx;
		height: 185rpx;
		/* border-radius: 10rpx; */
	}

	.remd-item-title {
		color: #222222;
		font-size: 28rpx;
		font-weight: 500;
		flex: 1;
		lines: 1;
		text-overflow: ellipsis;
		margin-top: 10rpx;
		height: 40rpx;
		/* #ifndef APP-NVUE */
		display: block;
		white-space: nowrap;
		overflow: hidden;
		/* #endif */
	}

	.remd-item-info {
		position: absolute;
		bottom: 0;
		background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5));
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: space-between;
		align-items: center;
		padding: 100rpx 20rpx 10rpx 20rpx;
		width: 330rpx;
		height: 150rpx;
		/* border-bottom-left-radius: 10rpx;
		border-bottom-right-radius: 10rpx; */
		/* #ifndef APP-PLUS */
		display: flex;
		width: 290rpx;
		height: 40rpx;
		/* #endif */
	}

	.remd-item-info-row {
		flex-direction: row;
		flex-wrap: nowrap;
		align-items: center;
		/* #ifndef APP-PLUS */
		display: flex;
		/* #endif */
	}

	.remd-item-info-text {
		color: #FFFFFF;
		font-size: 24rpx;
		padding-left: 4rpx;
	}

	/* 评论 */
	.comment {
		flex: 1;
		/* #ifndef APP-PLUS */
		display: flex;
		/* #endif */
	}

	.comment-item {
		flex-direction: row;
		flex-wrap: nowrap;
		align-items: flex-start;
		padding: 30rpx;
		position: relative;
		/* #ifndef APP-PLUS */
		display: flex;
		/* #endif */
	}

	.comment-item-headimg {
		width: 80rpx;
		height: 80rpx;
		border-radius: 80rpx;
		margin-right: 10rpx;
	}

	.comment-item-content {
		flex: 1;
		/* margin-right: 70rpx; */
		/* #ifndef APP-PLUS */
		display: flex;
		flex-direction: column;
		/* #endif */
	}

	.comment-item-name {
		font-weight: 500;
		color: #7c7c7c;
		font-size: 28rpx;
	}

	.comment-item-text {
		color: #222222;
		font-size: 28rpx;
		margin-top: 10rpx;
		/* width: 600px; */
	}

	.comment-item-time {
		color: #7c7c7c;
		font-size: 24rpx;
		position: absolute;
		right: 30rpx;
	}

	.fixed-comment {
		background-color: #FFFFFF;
		padding: 12px 30rpx;
		box-shadow: 0px -3px 6px rgba(0, 0, 0, 0.16);
		position: fixed;
		left: 0;
		bottom: 0;
		width: 750rpx;
		/* #ifndef APP-PLUS */
		display: flex;
		width: 690rpx;
		/* #endif */
	}

	.comment-opt {
		flex-direction: row;
		align-items: flex-end;
		position: relative;
		/* #ifndef APP-PLUS */
		display: flex;
		flex: 1;
		/* #endif */
	}

	.comment-input-edit {
		position: absolute;
		top: 10rpx;
		right: 30rpx;
		width: 50rpx;
		height: 50rpx;
	}

	.comment-textarea {
		flex: 1;
		/* height: 70rpx; */

		border-radius: 70rpx;
		padding: 10rpx 40rpx;
		background-color: #f8f8fb;
	}

	.comment-input {
		/* display: block; */
		/* text-align: center; */
		/* line-height: 70rpx; */
		padding: 5rpx 0;
		justify-content: center;
		align-items: center;
		color: #222222;
		font-size: 28rpx;
		/* #ifndef APP-PLUS */
		width: auto;
		display: flex;
		flex: 1;
		/* #endif */
	}

	.hide_textarea {
		position: absolute;
		top: 0;
		left: 0;
		width: 750rpx;
		height: 98rpx;
		/* background-color: rgba(0, 0, 0, .3); */
	}

	.comment-send {
		/* align-self:flex-start; */
		align-items: flex-end;
		width: 140rpx;
		height: 70rpx;
		line-height: 70rpx;
		border-radius: 70rpx;
		background-color: #dedede;
		background-image: linear-gradient(to right, #dedede, #dedede);
		color: #7c7c7c;
		font-size: 28rpx;
		text-align: center;
		margin-left: 30rpx;
	}

	.comment-send-active {
		color: #ffffff;
		background-image: linear-gradient(to right, #ffc400, #ff7f00);
	}

	.popup-vip {
		width: 652rpx;
		height: 738rpx;
	}

	.popup-vip-bg {
		width: 652rpx;
		/* height: 738rpx; */
	}

	.endText {
		color: #7c7c7c;
		font-size: 24rpx;
		text-align: center;
		margin-top: 20rpx;
		margin-bottom: 20rpx;
		height: 40rpx;
	}
</style>
