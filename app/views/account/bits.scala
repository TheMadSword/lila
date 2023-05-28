package views.html
package account

import lila.api.{ Context, given }
import lila.app.templating.Environment.{ given, * }
import lila.app.ui.ScalatagsTemplate.{ *, given }
import lila.pref.PrefCateg
import lila.user.User
import controllers.routes

object bits:

  def data(u: User)(implicit ctx: Context) =
    account.layout(title = s"${u.username} - personal data", active = "security") {
      div(cls := "account security personal-data box box-pad")(
        h1(cls := "box__top")("My personal data"),
        div(cls := "personal-data__header")(
          p("Here is all personal information Lichess has about ", userLink(u)),
          a(cls := "button", href := s"${routes.Account.data}?user=${u.id}&text=1", downloadAttr)(
            trans.download()
          )
        )
      )
    }

  def categName(categ: lila.pref.PrefCateg)(implicit ctx: Context): String =
    categ match
      case PrefCateg.Display      => trans.preferences.display.txt()
      case PrefCateg.ChessClock   => trans.preferences.chessClock.txt()
      case PrefCateg.GameBehavior => trans.preferences.gameBehavior.txt()
      case PrefCateg.Privacy      => trans.preferences.privacy.txt()

  def setting(name: Frag, body: Frag) = st.section(h2(name), body)

  def radios[A](field: play.api.data.Field, options: Iterable[(A, String)], prefix: String = "ir") =
    st.group(cls := "radio")(
      options.map { (key, value) =>
        val id      = s"$prefix${field.id}_$key"
        val checked = field.value has key.toString
        div(
          input(
            st.id := id,
            checked option st.checked,
            tpe      := "radio",
            st.value := key.toString,
            name     := field.name
          ),
          label(`for` := id)(value)
        )
      }.toList
    )
  
  def unwrapOption(s: Option[String]): Int = {
    s.match {
      case Some(value) => value.toInt
      case _ => 0
    }
  }

  //TODO : Change name to say that we have a "empty choice"
  def checkboxes[A](field: play.api.data.Field, options: Iterable[(A, String)], prefix: String = "ir") =
    st.group(cls := "radio")(
      ///
      List(div(
        input(
            st.id := s"$prefix${field.id}_hidden",
            true option st.checked,
            tpe      := "hidden",
            st.value := "",
            name     := field.name
        ),
        st.style := "display: none;"
      ))
      :::
      ///
      options.map { (key, value) =>
        val id      = s"$prefix${field.id}_$key"
        pp("REDREDREDYOLOYOLOYOLO for value " + value)
        pp("unwrapOption(field.value)" + unwrapOption(field.value))
        pp("key.toSring.toInt = " + key.toString.toInt)
        val intVal = unwrapOption(field.value)
        val keyVal = key.toString.toInt
        val checked = keyVal == 0 && intVal == 0 || 
          keyVal > 0 && (intVal & key.toString.toInt) == key.toString.toInt //TODO change @ bits; + never
        pp("bit = " + (unwrapOption(field.value) & key.toString.toInt))
        pp("checked = " + checked)
        div(
          input(
            st.id := id,
            checked option st.checked,
            tpe      := "checkbox",
            st.value := key.toString,
            name     := field.name
          ),
          label(`for` := id)(value)
        )
      }.toList //prepend/append to map for never/always ?
    )
