import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50">
      <Header />

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          {/* 标题部分 */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              关于我们
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          </div>

          {/* 核心介绍 */}
          <section className="mb-10">
            <div className="text-lg leading-relaxed text-gray-700 space-y-4">
              <p className="text-xl font-medium text-gray-800">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 font-bold">
                  KnowYourself 知己
                </span>
                {' '}是一个帮助人们认识自我、理解内心的心理测评与成长平台。
              </p>
              <p className="italic text-gray-600 border-l-4 border-blue-300 pl-4 py-2 bg-blue-50">
                我们相信，每个人都值得被自己理解——真正的成长，始于对自我的觉察与接纳。
              </p>
            </div>
          </section>

          {/* 我们提供什么 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full mr-3"></span>
              我们提供什么
            </h2>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 space-y-3 text-gray-700 leading-relaxed">
              <p>
                在这里，我们收集并整理了来自<strong>心理学</strong>、<strong>人格研究</strong>与<strong>行为科学</strong>领域的多维度测评工具，
                包括人格、动机、情绪、依恋、自我控制等主题，
                让用户通过专业、科学的问卷测评，更清晰地看见自己的内在模式。
              </p>
            </div>
          </section>

          {/* 我们的使命 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full mr-3"></span>
              我们的使命
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                我们致力于以 <span className="font-semibold text-blue-600">理性</span>、
                <span className="font-semibold text-purple-600">温柔</span>、
                <span className="font-semibold text-indigo-600">科学</span> 的方式呈现心理学，
                帮助你了解——
              </p>
              <ul className="space-y-3 ml-6">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-3 text-xl">•</span>
                  <span>是什么塑造了你的选择</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-3 text-xl">•</span>
                  <span>是什么影响了你的关系</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-3 text-xl">•</span>
                  <span>以及，怎样成为一个更完整的自己</span>
                </li>
              </ul>
            </div>
          </section>

          {/* 我们的理念 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full mr-3"></span>
              我们的理念
            </h2>
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 space-y-3">
              <p className="text-gray-700 leading-relaxed">
                了解自己，不是标签化，而是<strong>理解</strong>和<strong>成长</strong>。
              </p>
              <p className="text-gray-700 leading-relaxed">
                每一个测评结果，都不是为了给你贴上固定的标签，
                而是为了帮助你更深入地理解自己的行为模式、情绪倾向和人际互动方式。
                自我认知是一场持续的旅程，而不是终点。
              </p>
            </div>
          </section>

          {/* 联系我们 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full mr-3"></span>
              联系我们
            </h2>
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 space-y-3">
              <p className="text-gray-700 leading-relaxed">
                邮箱：knowyourself_ofc@163.com
              </p>
              <p className="text-gray-700 leading-relaxed" >
                <a href="https://www.xiaohongshu.com/user/profile/6844647c000000001e03f355">
                    小红书：Know Yourself心理测评
                </a>
              </p>
            </div>
          </section>

          {/* 结尾口号 */}
          <div className="text-center mt-12 pt-8 border-t border-gray-200">
            <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 mb-2">
              KnowYourself · 知己
            </p>
            <p className="text-lg text-gray-600 italic">
              了解更真实的自己
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
