import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-light/10 to-white">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">用户协议</h1>

          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. 协议的接受与修改</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                欢迎使用心理量表测评平台（以下简称"本平台"）。在使用本平台提供的心理测评服务前，请您务必仔细阅读并充分理解本协议的全部内容。
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                一旦您勾选"同意"或开始使用本平台服务，即表示您已充分阅读、理解并同意接受本协议的全部约束。如您不同意本协议的任何条款，请立即停止使用本平台。
              </p>
              <p className="text-gray-700 leading-relaxed">
                本平台有权根据法律法规变化或业务调整需要，不时修订本协议。修订后的协议将在平台上公布，恕不另行单独通知。若您在协议修订后继续使用本平台，视为您已接受修订后的协议。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. 服务说明</h2>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">2.1 服务内容</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                本平台为用户提供基于标准化心理量表的在线自测服务，包括但不限于心理健康评估、情绪状态分析、行为模式测评等。测评结果以报告形式呈现，供用户自我了解与参考。
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">2.2 非医疗性质</h3>
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4">
                <p className="text-gray-800 font-semibold">⚠️ 重要声明：</p>
                <ul className="list-disc list-inside text-gray-700 mt-2 space-y-2">
                  <li>本平台非医疗机构，测评结果不具备临床诊断效力</li>
                  <li>测评内容仅供自我了解与学习参考，不构成医疗、心理或精神健康诊断与治疗建议</li>
                  <li>若您存在严重情绪困扰、焦虑或行为成瘾问题，必须寻求专业心理医生或咨询师帮助</li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">2.3 适用人群</h3>
              <p className="text-gray-700 leading-relaxed">
                本平台服务主要面向成年用户（18周岁及以上）。未满18周岁的用户，需在监护人的指导和陪同下使用本平台，监护人需对未成年人的使用行为承担监护责任。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. 用户权利与义务</h2>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.1 账号与安全</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>用户可选择匿名或注册账号使用本平台服务</li>
                <li>用户应妥善保管账号密码，对账号下的所有行为负责</li>
                <li>若发现账号被盗用或存在安全隐患，应立即通知本平台</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.2 真实作答</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                为确保测评结果的准确性和有效性，用户应：
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>根据自身真实情况如实作答，不刻意隐瞒或夸大</li>
                <li>在安静、不受干扰的环境中完成测评</li>
                <li>认真阅读题目说明，避免随意选择或遗漏题目</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.3 禁止行为</h3>
              <p className="text-gray-700 leading-relaxed mb-2">用户不得从事以下行为：</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>利用技术手段干扰、破坏平台正常运行</li>
                <li>恶意攻击、侵入平台系统或数据库</li>
                <li>传播虚假信息、侵犯他人隐私或知识产权</li>
                <li>将测评结果用于商业目的或非法用途</li>
                <li>冒充他人或虚假注册账号</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. 知识产权</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                本平台所使用的量表、题目、评分算法、界面设计、文案内容等知识产权归本平台或原始版权方所有。未经授权，用户不得：
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>复制、传播、修改或商业化使用平台内容</li>
                <li>将测评题目或算法用于其他平台或项目</li>
                <li>逆向工程、反编译或破解平台技术</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. 免责条款</h2>
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                <h3 className="text-lg font-bold text-red-900 mb-3">5.1 结果的局限性</h3>
                <ul className="list-disc list-inside text-red-800 space-y-2">
                  <li>测评结果仅供参考，不保证其科学性、完整性或适用性</li>
                  <li>用户应理性看待测评结果，不将其作为重大决策依据</li>
                  <li>因测评结果引发的误解、焦虑、冲突或其他后果，本平台不承担法律责任</li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">5.2 技术风险</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                因不可抗力（如网络故障、服务器维护、黑客攻击等）导致的服务中断、数据丢失或其他损失，本平台不承担责任。
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">5.3 第三方链接</h3>
              <p className="text-gray-700 leading-relaxed">
                本平台可能包含第三方网站或服务的链接。本平台对第三方内容不承担责任，用户访问第三方网站时应自行判断风险。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. 隐私保护</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                本平台高度重视用户隐私保护。关于个人信息收集、使用、存储的详细说明，请查阅
                <Link href="/privacy" className="text-primary hover:underline mx-1">《隐私政策》</Link>。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. 协议终止</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                发生以下情况时，本平台有权终止向用户提供服务：
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>用户违反本协议的任何条款</li>
                <li>用户从事违法、侵权或损害平台利益的行为</li>
                <li>用户主动申请注销账号或停止使用服务</li>
                <li>因业务调整或法律要求，平台停止运营相关服务</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. 争议解决</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                本协议的签订、履行、解释及争议解决均适用中华人民共和国法律（不包括香港、澳门、台湾地区法律）。
              </p>
              <p className="text-gray-700 leading-relaxed">
                因本协议产生的任何争议，双方应友好协商解决；协商不成的，任何一方均可向本平台所在地人民法院提起诉讼。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. 联系我们</h2>
              <p className="text-gray-700 leading-relaxed mb-2">
                如您对本协议有任何疑问或建议，请通过以下方式联系我们：
              </p>
              <ul className="list-none text-gray-700 space-y-2">
                <li>📧 电子邮件: support@yourdomain.com</li>
                <li>📍 联系地址: （待填写注册公司或运营主体地址）</li>
              </ul>
            </section>

            <div className="bg-gray-100 p-6 rounded-lg text-center">
              <p className="text-sm text-gray-600">
                本协议最后更新时间：2025年1月
              </p>
              <p className="text-sm text-gray-600 mt-2">
                © 2025 心理量表测评平台 版权所有
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition"
            >
              返回首页
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
