import Link from 'next/link'
import { PageTransition, FadeInUp, ScrollReveal, StaggerContainer, StaggerItem, AnimatedButton } from '@/components/animations'

export default function Home() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Navigation */}
        <nav className="p-6">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">Portfolio</h1>
            <div className="hidden md:flex space-x-8">
              <a href="#about" className="text-gray-300 hover:text-white transition-colors">About</a>
              <a href="#projects" className="text-gray-300 hover:text-white transition-colors">Projects</a>
              <Link href="/blog" className="text-gray-300 hover:text-white transition-colors">Blog</Link>
              <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="px-6 py-20">
          <div className="max-w-6xl mx-auto text-center">
            <FadeInUp delay={0.2}>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                Hello, I&apos;m{' '}
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Your Name
                </span>
              </h1>
            </FadeInUp>
            <FadeInUp delay={0.4}>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                A passionate developer creating amazing digital experiences with modern technologies
              </p>
            </FadeInUp>
            <FadeInUp delay={0.6}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <AnimatedButton
                  href="#projects"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-lg font-semibold"
                >
                  View My Work
                </AnimatedButton>
                <AnimatedButton
                  href="/contact"
                  className="border border-purple-400 text-purple-400 px-8 py-3 rounded-lg font-semibold hover:bg-purple-400 hover:text-white transition-colors"
                >
                  Contact Me
                </AnimatedButton>
              </div>
            </FadeInUp>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="px-6 py-20">
          <div className="max-w-6xl mx-auto">
            <ScrollReveal>
              <h2 className="text-4xl font-bold text-white text-center mb-12">About Me</h2>
            </ScrollReveal>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <ScrollReveal direction="left" delay={0.2}>
                <div className="w-64 h-64 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mx-auto"></div>
              </ScrollReveal>
              <ScrollReveal direction="right" delay={0.4}>
                <div className="text-gray-300 space-y-4">
                  <p className="text-lg">
                    I&apos;m a full-stack developer with a passion for creating beautiful, functional, and user-friendly applications.
                    With expertise in modern web technologies, I bring ideas to life through clean code and thoughtful design.
                  </p>
                  <p className="text-lg">
                    When I&apos;m not coding, you can find me exploring new technologies, contributing to open source projects,
                    or sharing knowledge with the developer community.
                  </p>
                  <StaggerContainer className="flex flex-wrap gap-3 mt-6">
                    {['React', 'Next.js', 'TypeScript', 'TailwindCSS', 'Node.js', 'Python'].map((tech) => (
                      <StaggerItem key={tech}>
                        <span className="bg-gray-800 text-purple-400 px-3 py-1 rounded-full text-sm font-semibold">
                          {tech}
                        </span>
                      </StaggerItem>
                    ))}
                  </StaggerContainer>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="px-6 py-20">
          <div className="max-w-6xl mx-auto">
            <ScrollReveal>
              <h2 className="text-4xl font-bold text-white text-center mb-12">Featured Projects</h2>
            </ScrollReveal>
            <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((project) => (
                <StaggerItem key={project}>
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 hover:scale-105 transition-transform">
                    <div className="h-48 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg mb-4"></div>
                    <h3 className="text-xl font-semibold text-white mb-2">Project {project}</h3>
                    <p className="text-gray-400 mb-4">
                      A brief description of this amazing project and the technologies used to build it.
                    </p>
                    <div className="flex gap-2">
                      <AnimatedButton className="text-purple-400 hover:text-white transition-colors">
                        Live Demo →
                      </AnimatedButton>
                      <AnimatedButton className="text-gray-400 hover:text-white transition-colors">
                        Code →
                      </AnimatedButton>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <ScrollReveal>
              <h2 className="text-4xl font-bold text-white mb-8">Let&apos;s Work Together</h2>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Have a project in mind? I&apos;d love to hear about it and discuss how we can bring your ideas to life.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.4}>
              <AnimatedButton
                href="/contact"
                className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-lg font-semibold"
              >
                Get In Touch
              </AnimatedButton>
            </ScrollReveal>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-6 py-8 border-t border-gray-800">
          <div className="max-w-6xl mx-auto text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Your Portfolio. Built with Next.js 15 and TailwindCSS.</p>
          </div>
        </footer>
      </div>
    </PageTransition>
  )
}
